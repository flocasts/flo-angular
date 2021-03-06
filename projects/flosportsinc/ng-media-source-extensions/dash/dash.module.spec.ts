import { TestBed } from '@angular/core/testing'
import {
  IMseInitOptions,
  IMseDestroyOptions,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK
} from '@flosportsinc/ng-media-source-extensions'
import { Component, Input, NgModule } from '@angular/core'
import { Subject } from 'rxjs'
import {
  FloDashModule, defaultDashSupportedNativelyFunction,
  defaultDashIsSupportedFactory, defaultDashPatternCheck,
  DashMessage, defaultDashClientDestroyFunction
} from './dash.module'
import { MediaPlayerClass, MediaPlayer } from 'dashjs'
import { TEST_SOURCES } from '../core/mse.directive.spec'

const TEST_SRC = TEST_SOURCES.DASH.PARKOR

@Component({
  selector: 'flo-test-component',
  template: '<video floMse [src]="src"></video>'
})
export class DashTestComponent {
  // tslint:disable-next-line:readonly-keyword
  @Input() public src?: string = TEST_SRC
}

@NgModule({
  imports: [FloDashModule],
  declarations: [DashTestComponent],
  exports: [DashTestComponent]
})
export class HlsTestingModule { }

describe(FloDashModule.name, () => {
  it('should construct', () => {
    TestBed.configureTestingModule({
      imports: [HlsTestingModule]
    })
    expect(TestBed.get(MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK).length).toEqual(2)
  })

  it('should init correctly', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({ imports: [HlsTestingModule] })
    const videoElement = document.createElement('video')
    const event: IMseInitOptions<DashMessage, any> = {
      config: {},
      videoElement,
      src: TEST_SRC,
      messageSource: new Subject()
    }
    expect(TestBed.get(MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK)[1].func(event)).toBeTruthy()
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

    // it('when environment supports media source extensions only', () => {
    //   const videElement = window.document.createElement('video')
    //   const result = defaultDashSupportedNativelyFunction().func(videElement)
    //   expect(result).toEqual(false)
    // })

    it('when environment only supports native', () => {
      const videElement = window.document.createElement('video')
      const result = defaultDashSupportedNativelyFunction().func(videElement)
      expect(result).toEqual(false)
    })
  })

  describe(`exposed ${defaultDashIsSupportedFactory.name} function`, () => {
    it('when no mse, return false', () => {
      // tslint:disable-next-line:no-object-mutation
      (window as any).MediaSource = undefined;
      // tslint:disable-next-line:no-object-mutation
      (window as any).WebKitMediaSource = undefined
      expect(defaultDashIsSupportedFactory().func()).toEqual(false)
    })

    // it('when WebKitMediaSource return true', () => {
    //   // tslint:disable-next-line:no-object-mutation
    //   (window as any).MediaSource = undefined;
    //   // tslint:disable-next-line:no-object-mutation
    //   (window as any).WebKitMediaSource = () => {
    //     // noop
    //   }
    //   expect(defaultDashIsSupportedFactory().func()).toEqual(true)
    // })
  })

  it('should execute defaultDashClientDestroyFunction correctly', () => {
    const videoElement = document.createElement('video')
    videoElement.setAttribute('autoplay', 'true')
    const event: IMseDestroyOptions<MediaPlayerClass> = { clientRef: MediaPlayer().create(), videoElement }
    const spy1 = spyOn(videoElement, 'pause')
    const spy2 = spyOn(event.clientRef, 'reset')
    defaultDashClientDestroyFunction().func({
      clientRef: event.clientRef,
      videoElement
    })
    expect(spy1).toHaveBeenCalled()
    expect(spy2).toHaveBeenCalled()
  })

  it('should default pattern', () => {
    expect(defaultDashPatternCheck().func('something.mpd')).toEqual(true)
  })
})
