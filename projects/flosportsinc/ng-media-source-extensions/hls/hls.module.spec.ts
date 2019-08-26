import {
  FloHlsModule, defaultHlsSupportedNativelyFunction, defaultIsSupportedFactory,
  DEFAULT_MODULE_HLS_CONFIG,
  selfHealSwitch
} from './hls.module'
import { TestBed, async } from '@angular/core/testing'
import * as Hls from 'hls.js'
import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
  SUPPORTS_MSE_TARGET_NATIVELY,
  MEDIA_SOURCE_EXTENSION_LIBRARY_CONFIG,
  MseDirective
} from '@flosportsinc/ng-media-source-extensions'
import { Component, Input, NgModule } from '@angular/core'
import { take } from 'rxjs/operators'
import { Subject, ObjectUnsubscribedError } from 'rxjs'
import { By } from '@angular/platform-browser'
import { TEST_SOURCES } from '../core/mse.directive.spec'
import { IMseExecutionConfig } from '../core/mse.tokens'

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
  imports: [FloHlsModule],
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
  }).compileComponents()
}

const shouldUnsubscribeFromInternalNgAfterViewInit = async(() => {
  const wrapper = createSut()
  const internalNgAfterViewInit$ = (wrapper.instance as any)._ngAfterViewInit$ as Subject<undefined>

  expect(() => {
    internalNgAfterViewInit$.pipe(take(1)).subscribe()
  }).toThrow(new ObjectUnsubscribedError())

  wrapper.hoist.destroy()
})

describe(FloHlsModule.name, () => {
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
  })

  describe('when using module config', () => {
    afterEach(() => TestBed.resetTestingModule())

    it('should handle empty config object', done => {
      TestBed.configureTestingModule({ imports: [FloHlsModule.config({})], declarations: [HlsTestComponent] })

      const sut = TestBed.get(MEDIA_SOURCE_EXTENSION_LIBRARY_CONFIG)[1]
      expect(sut).toEqual({ execKey: 'HLS', config: DEFAULT_MODULE_HLS_CONFIG })
      done()
    })

    it('should handle config object', done => {
      TestBed.configureTestingModule({
        imports: [FloHlsModule.config({})],
        declarations: [HlsTestComponent]
      })

      const sut = TestBed.get(MEDIA_SOURCE_EXTENSION_LIBRARY_CONFIG)[1]
      expect(sut).toEqual({ execKey: 'HLS', config: DEFAULT_MODULE_HLS_CONFIG })
      done()
    })

    it('should handle config object', done => {
      TestBed.configureTestingModule({
        imports: [FloHlsModule.config({
          hlsConfig: {
            capLevelToPlayerSize: false
          }
        })],
        declarations: [HlsTestComponent]
      }).compileComponents()

      const sut = createSut()
      sut.hoist.detectChanges()

      const injectedConfigs = TestBed.get(MEDIA_SOURCE_EXTENSION_LIBRARY_CONFIG)
      const hlsConfigs = injectedConfigs.filter(a => a.execKey === 'HLS')
      const defaultConfig = hlsConfigs.find(a => !a.override)
      const override = hlsConfigs.find(a => a.override)
      const directiveParsed = sut.instance.floMseConfig
      const directiveParsedHls = sut.instance.floMseConfig.find(a => a.execKey === 'HLS') as IMseExecutionConfig<Hls.Config>

      expect(injectedConfigs.length).toEqual(3)
      expect(hlsConfigs.length).toEqual(2)
      expect(defaultConfig.config).toEqual(DEFAULT_MODULE_HLS_CONFIG)
      expect(override.config).toEqual({
        ...DEFAULT_MODULE_HLS_CONFIG,
        capLevelToPlayerSize: false
      })

      // directive should tidy up configs
      expect(directiveParsed.length).toEqual(2)
      expect(directiveParsedHls.config).toEqual({
        ...DEFAULT_MODULE_HLS_CONFIG,
        capLevelToPlayerSize: false
      } as any)


      // handle directive level override
      sut.instance.setFloMseConfig([{ execKey: 'HLS', config: { capLevelToPlayerSize: true }}])
      sut.hoist.detectChanges()

      const retrieve = sut.instance.floMseConfig.find(a => a.execKey === 'HLS') as IMseExecutionConfig<Hls.Config>

      expect(retrieve.config).toEqual({
        ...DEFAULT_MODULE_HLS_CONFIG,
        capLevelToPlayerSize: true
      } as any)

      done()
    })
  })

  describe('self heal', () => {
    it('should handle Hls.ErrorTypes.NETWORK_ERROR', () => {
      const client = new Hls()
      const spyConsole = spyOn(console, 'log')
      const spyHls = spyOn(client, 'startLoad').and.callThrough()
      selfHealSwitch(client, { type: Hls.ErrorTypes.NETWORK_ERROR, fatal: true, details: 'info' } as any)
      expect(spyConsole).toHaveBeenCalled()
      expect(spyHls).toHaveBeenCalled()
    })

    it('should handle Hls.ErrorTypes.MEDIA_ERROR', () => {
      const client = new Hls()
      const spyConsole = spyOn(console, 'log')
      const spyHls = spyOn(client, 'recoverMediaError').and.callThrough()
      selfHealSwitch(client, { type: Hls.ErrorTypes.MEDIA_ERROR, fatal: true, details: 'info' } as any)
      expect(spyConsole).toHaveBeenCalled()
      expect(spyHls).toHaveBeenCalled()
    })

    it('should handle Hls.ErrorTypes.OTHERS', () => {
      const client = new Hls()
      const spyConsole = spyOn(console, 'error')
      const spyHls = spyOn(client, 'destroy').and.callThrough()
      selfHealSwitch(client, { type: 'other', fatal: true, details: 'info' } as any)
      expect(spyConsole).toHaveBeenCalled()
      expect(spyHls).toHaveBeenCalled()
    })
  })
})
