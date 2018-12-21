import { TestBed, async } from '@angular/core/testing'
import {
  IMseSrcChangeOptions, SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
  SUPPORTS_MSE_TARGET_NATIVELY,
  MseDirective,
  IMseInit,
  IMseInitOptions
} from '@flosportsinc/ng-media-source-extensions'
import { SimpleChange, Component, Input, NgModule } from '@angular/core'
import { take } from 'rxjs/operators'
import { Subject, ObjectUnsubscribedError } from 'rxjs'
import { By } from '@angular/platform-browser'
import {
  DashModule, defaultDashSupportedNativelyFunction,
  defaultDashIsSupportedFactory, defaultDashClientSrcChangeFunction, defaultDashPatternCheck, DashMessage, defaultDashClientInitFunction
} from './dash.module'
import { MediaPlayerClass, MediaPlayer } from 'dashjs'

const TEST_SRC = 'http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8'

@Component({
  selector: 'flo-test-component',
  template: '<video floMse [src]="src"></video>'
})
export class DashTestComponent {
  // tslint:disable-next-line:readonly-keyword
  @Input() public src?: string = TEST_SRC
}

@NgModule({
  imports: [DashModule],
  declarations: [DashTestComponent],
  exports: [DashTestComponent]
})
export class HlsTestingModule { }

// const createSut = () => {
//   const hoist = TestBed.createComponent(DashTestComponent)
//   hoist.autoDetectChanges()
//   const directive = hoist.debugElement.query(By.directive(MseDirective))
//   return {
//     hoist,
//     directive,
//     instance: directive.injector.get(MseDirective)
//   }
// }

// const setTestBed = (supportsMle: boolean) => (native: boolean) => {
//   TestBed.configureTestingModule({
//     imports: [HlsTestingModule],
//     providers: [
//       {
//         provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
//         useValue: supportsMle,
//         multi: true
//       },
//       {
//         provide: SUPPORTS_MSE_TARGET_NATIVELY,
//         useValue: () => native,
//         multi: true
//       }
//     ]
//   })
// }

// const shouldUnsubscribeFromInternalNgOnDestroy = async(() => {
//   const wrapper = createSut()
//   const internalNgOnDestroy$ = (wrapper.instance as any)._ngOnDestroy$ as Subject<undefined>

//   internalNgOnDestroy$.pipe(take(1)).subscribe(response => {
//     expect(response).toBeUndefined()
//   })

//   wrapper.hoist.destroy()

//   expect(() => internalNgOnDestroy$.next()).toThrow(new ObjectUnsubscribedError())
// })

// const shouldUnsubscribeFromInternalNgAfterViewInit = async(() => {
//   const wrapper = createSut()
//   const internalNgAfterViewInit$ = (wrapper.instance as any)._ngAfterViewInit$ as Subject<undefined>

//   expect(() => {
//     internalNgAfterViewInit$.pipe(take(1)).subscribe()
//   }).toThrow(new ObjectUnsubscribedError())

//   wrapper.hoist.destroy()
// })

// const shouldCompileTestComponent = done => {
//   expect(createSut().hoist).toBeDefined()
//   done()
// }

// const shouldCompilerDirective = done => {
//   expect(createSut().directive).toBeDefined()
//   done()
// }

// const skipSrcChangeWhenValueIs = (sc: SimpleChange) => {
//   const wrapper = createSut()
//   const spy = spyOn((wrapper.instance as any)._srcChanges$, 'next')
//   wrapper.instance.ngOnChanges({
//     floHls: sc
//   })
//   expect(spy).not.toHaveBeenCalled()
// }

describe(DashModule.name, () => {
  it('should construct', () => {
    TestBed.configureTestingModule({
      imports: [DashModule]
    })
  })

  it('should init correcltly', () => {
    const videoElement = document.createElement('video')
    const event: IMseInitOptions<DashMessage> = {
      videoElement,
      src: 'http://www.video.com',
      messageSource: new Subject()
    }
    defaultDashClientInitFunction().func(event)
  })

  describe(`exposed ${defaultDashSupportedNativelyFunction.name} factory function`, () => {
    it('when default test environment (no native support)', () => {
      const videElement = window.document.createElement('video')
      const result = defaultDashSupportedNativelyFunction().func(videElement)
      expect(result).toEqual(false)
    })

    it('when both are supported, default to MSE library over native', () => {
      const videElement = window.document.createElement('video')
      const result = defaultDashSupportedNativelyFunction().func(videElement)
      expect(result).toEqual(false)
    })

    it('when environment supports media source extensions only', () => {
      const videElement = window.document.createElement('video')
      const result = defaultDashSupportedNativelyFunction().func(videElement)
      expect(result).toEqual(false)
    })

    it('when environment only supports native', () => {
      const videElement = window.document.createElement('video')
      const result = defaultDashSupportedNativelyFunction().func(videElement)
      expect(result).toEqual(false)
    })
  })

  describe(`exposed ${defaultDashIsSupportedFactory.name} function`, () => {
    it('when default test environment', () => {
      expect(defaultDashIsSupportedFactory().func()).toEqual(true)
    })
  })

  describe(`exposed ${defaultDashClientSrcChangeFunction.name} factory function`, () => {
    it('should reset DASH client with new source', () => {
      const videoElement = document.createElement('video')
      const event: IMseSrcChangeOptions<MediaPlayerClass> = { clientRef: MediaPlayer().create(), src: '/new-url', videoElement }
      const spy1 = spyOn(event.clientRef, 'reset')
      const spy2 = spyOn(event.clientRef, 'attachView')
      const spy3 = spyOn(event.clientRef, 'attachSource')
      defaultDashClientSrcChangeFunction().func(event)
      expect(spy1).toHaveBeenCalled()
      expect(spy2).toHaveBeenCalledWith(event.videoElement)
      expect(spy3).toHaveBeenCalledWith(event.src)
    })
  })

  // describe(`when client supports Media Source Extensions`, () => {
  //   beforeEach(() => setTestBed(true)(false))
  //   afterEach(() => TestBed.resetTestingModule())

  //   it('should compile the test component', shouldCompileTestComponent)
  //   it('should compile the directive under test', shouldCompilerDirective)

  //   it('should not trigger MSE source change when same src string', done => {
  //     const wrapper = createSut()
  //     const spy = spyOn(wrapper.instance as any, '_mseSourceChangeTask')
  //     wrapper.instance.ngOnChanges({
  //       src: new SimpleChange(TEST_SRC, 'http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8', false)
  //     })
  //     expect(spy).not.toHaveBeenCalled()
  //     done()
  //   })

  //   it('should skip src change when value is same', () => {
  //     skipSrcChangeWhenValueIs(new SimpleChange(TEST_SRC, TEST_SRC, false))
  //   })

  //   it('should skip src change when value is undefined', () => {
  //     skipSrcChangeWhenValueIs(new SimpleChange(undefined, undefined, false))
  //   })

  //   it('should unsubscribe from internal ngOnDestroy$ subject after single event emission', shouldUnsubscribeFromInternalNgOnDestroy)
  //   it('should unsubscribe from internal ngAfterViewInit$ subject after single event emission',
  //     shouldUnsubscribeFromInternalNgAfterViewInit)
  // })

  // describe(`when supports mse client natively`, () => {
  //   beforeEach(() => setTestBed(false)(true))
  //   afterEach(() => TestBed.resetTestingModule())

  //   it('should compile the test component', shouldCompileTestComponent)
  //   it('should compile the directive under test', shouldCompilerDirective)
  //   it('should unsubscribe from internal ngOnDestroy$ subject after single event emission', shouldUnsubscribeFromInternalNgOnDestroy)
  //   it('should unsubscribe from internal ngAfterViewInit$ subject after single event emission',
  //     shouldUnsubscribeFromInternalNgAfterViewInit)
  // })

  it('should default pattern', () => {
    expect(defaultDashPatternCheck().func('something.mpd')).toEqual(true)
  })
})
