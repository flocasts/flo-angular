import {
  HlsModule, defaultHlsSupportedNativelyFunction, defaultIsSupportedFactory,
  MEDIA_SOURCE_EXTENSION_HLS_INIT_CONFIG,
  DEFAULT_MODULE_CONFIG,
  selfHealSwitch
} from './hls.module'
import { TestBed, async } from '@angular/core/testing'
import * as Hls from 'hls.js'
import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
  SUPPORTS_MSE_TARGET_NATIVELY,
  MseDirective
} from '@flosportsinc/ng-media-source-extensions'
import { Component, Input, NgModule } from '@angular/core'
import { take, filter } from 'rxjs/operators'
import { Subject, ObjectUnsubscribedError } from 'rxjs'
import { By } from '@angular/platform-browser'
import { TEST_SOURCES } from '../core/mse.directive.spec'

const TEST_SRC = TEST_SOURCES.HLS.TINY

@Component({
  selector: 'flo-test-component',
  template: '<video floMse [src]="src"></video>'
})
export class HlsTestComponent {
  // tslint:disable-next-line:readonly-keyword
  @Input() public src?: string = TEST_SRC
}

@NgModule({
  imports: [HlsModule],
  declarations: [HlsTestComponent],
  exports: [HlsTestComponent]
})
export class HlsTestingModule { }

const createSut = () => {
  const hoist = TestBed.createComponent(HlsTestComponent)
  hoist.autoDetectChanges()
  const directive = hoist.debugElement.query(By.directive(MseDirective))
  return {
    hoist,
    directive,
    instance: directive.injector.get(MseDirective)
  }
}

const setTestBed = (supportsMle: boolean) => (native: boolean) => {
  TestBed.configureTestingModule({
    imports: [HlsTestingModule],
    providers: [
      {
        provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
        useValue: supportsMle,
        multi: true
      },
      {
        provide: SUPPORTS_MSE_TARGET_NATIVELY,
        useValue: () => native,
        multi: true
      }
    ]
  })
}

const shouldUnsubscribeFromInternalNgAfterViewInit = async(() => {
  const wrapper = createSut()
  const internalNgAfterViewInit$ = (wrapper.instance as any)._ngAfterViewInit$ as Subject<undefined>

  expect(() => {
    internalNgAfterViewInit$.pipe(take(1)).subscribe()
  }).toThrow(new ObjectUnsubscribedError())

  wrapper.hoist.destroy()
})

describe(HlsModule.name, () => {
  describe(`exposed ${defaultHlsSupportedNativelyFunction.name} factory function`, () => {
    it('when default test environment (no native support)', () => {
      const videElement = window.document.createElement('video')
      const spy = spyOn(videElement, 'canPlayType')
      const result = defaultHlsSupportedNativelyFunction().func(videElement)
      expect(spy).toHaveBeenCalledWith('application/vnd.apple.mpegurl')
      expect(result).toEqual(false)
    })

    // it('when both are supported, default to MSE library over native', () => {
    //   const videElement = window.document.createElement('video')
    //   spyOn(videElement, 'canPlayType').and.returnValue('probably')
    //   spyOn(Hls, 'isSupported').and.callFake(() => true)
    //   const result = defaultHlsSupportedNativelyFunction().func(videElement)
    //   expect(result).toEqual(false)
    // })

    // it('when environment supports media source extensions only', () => {
    //   const videElement = window.document.createElement('video')
    //   spyOn(videElement, 'canPlayType').and.returnValue('')
    //   spyOn(Hls, 'isSupported').and.callFake(() => true)
    //   const result = defaultHlsSupportedNativelyFunction().func(videElement)
    //   expect(result).toEqual(false)
    // })

    it('when environment only supports native (iOS safari, for example)', () => {
      const videElement = window.document.createElement('video')
      spyOn(videElement, 'canPlayType').and.returnValue('probably')
      spyOn(Hls, 'isSupported').and.callFake(() => false)
      const result = defaultHlsSupportedNativelyFunction().func(videElement)
      expect(result).toEqual(true)
    })
  })

  describe(`exposed ${defaultIsSupportedFactory.name} function`, () => {
    it('when hlsjs supported', () => {
      spyOn(Hls, 'isSupported').and.callFake(() => true)
      expect(defaultIsSupportedFactory().func()).toEqual(true)
    })
    it('when hlsjs not supported', () => {
      spyOn(Hls, 'isSupported').and.callFake(() => false)
      expect(defaultIsSupportedFactory().func()).toEqual(false)
    })
  })

  // describe(`exposed ${defaultMseClientSrcChangeFunction.name} factory function`, () => {
  //   it('should reset HLS client with new source', () => {
  //     const videoElement = document.createElement('video')
  //     const event: IMseSrcChangeOptions<Hls> = {
  //       clientRef: {
  //         loadSource: () => { },
  //         detachMedia: () => { },
  //         attachMedia: () => { }
  //       } as any, src: '/new-url', videoElement
  //     }
  //     const spy1 = spyOn(event.clientRef, 'detachMedia')
  //     const spy2 = spyOn(event.clientRef, 'loadSource')
  //     const spy3 = spyOn(event.clientRef, 'attachMedia')
  //     defaultMseClientSrcChangeFunction().func(event)
  //     expect(spy1).toHaveBeenCalled()
  //     expect(spy2).toHaveBeenCalledWith(event.src)
  //     expect(spy3).toHaveBeenCalledWith(event.videoElement)
  //   })
  // })

  describe(`when supports mse client natively`, () => {
    beforeEach(() => setTestBed(false)(true))
    afterEach(() => TestBed.resetTestingModule())
    it('should unsubscribe from internal ngAfterViewInit$ subject after single event emission',
      shouldUnsubscribeFromInternalNgAfterViewInit)
  })

  describe('when using module config', () => {
    it('should handle empty config object', done => {
      TestBed.configureTestingModule({ imports: [HlsModule.config()], declarations: [HlsTestComponent] })

      const sut = TestBed.get(MEDIA_SOURCE_EXTENSION_HLS_INIT_CONFIG)
      expect(sut).toEqual(DEFAULT_MODULE_CONFIG)
      done()
    })

    it('should handle config object', done => {
      TestBed.configureTestingModule({
        imports: [HlsModule.config({})],
        declarations: [HlsTestComponent]
      })

      const sut = TestBed.get(MEDIA_SOURCE_EXTENSION_HLS_INIT_CONFIG)
      expect(sut).toEqual(DEFAULT_MODULE_CONFIG)
      done()
    })
  })

  describe('self heal', () => {
    it('should handle Hls.ErrorTypes.NETWORK_ERROR', () => {
      const client = new Hls()
      const spyConsole = spyOn(console, 'log')
      const spyHls = spyOn(client, 'startLoad').and.callThrough()
      selfHealSwitch(client, { type: Hls.ErrorTypes.NETWORK_ERROR, fatal: true } as any)
      expect(spyConsole).toHaveBeenCalledWith('Fatal network error encountered, trying to recover')
      expect(spyHls).toHaveBeenCalled()
    })

    it('should handle Hls.ErrorTypes.MEDIA_ERROR', () => {
      const client = new Hls()
      const spyConsole = spyOn(console, 'log')
      const spyHls = spyOn(client, 'recoverMediaError').and.callThrough()
      selfHealSwitch(client, { type: Hls.ErrorTypes.MEDIA_ERROR, fatal: true } as any)
      expect(spyConsole).toHaveBeenCalledWith('Fatal media error encountered, trying to recover')
      expect(spyHls).toHaveBeenCalled()
    })

    it('should handle Hls.ErrorTypes.OTHERS', () => {
      const client = new Hls()
      const spyConsole = spyOn(console, 'log')
      const spyHls = spyOn(client, 'destroy').and.callThrough()
      selfHealSwitch(client, { type: 'other', fatal: true } as any)
      expect(spyConsole).toHaveBeenCalledWith('Fatal error, hls client destroyed')
      expect(spyHls).toHaveBeenCalled()
    })
  })

})
