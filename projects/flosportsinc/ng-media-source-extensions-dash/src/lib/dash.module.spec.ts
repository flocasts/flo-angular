import { TestBed } from '@angular/core/testing'
import {
  IMseSrcChangeOptions,
  IMseInitOptions,
  IMseDestroyOptions
} from '@flosportsinc/ng-media-source-extensions'
import { Component, Input, NgModule } from '@angular/core'
import { Subject } from 'rxjs'
import {
  DashModule, defaultDashSupportedNativelyFunction,
  defaultDashIsSupportedFactory, defaultDashClientSrcChangeFunction, defaultDashPatternCheck,
  DashMessage, defaultDashClientInitFunction, defaultDashClientDestroyFunction
} from './dash.module'
import { MediaPlayerClass, MediaPlayer } from 'dashjs'

const TEST_SRC = 'http://www.streambox.fr/playlists/x36xhzz/x36xhzz.mpd'

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
    it('when no mse, return false', () => {
      // tslint:disable-next-line:no-object-mutation
      (window as any).MediaSource = undefined;
      // tslint:disable-next-line:no-object-mutation
      (window as any).WebKitMediaSource = undefined
      expect(defaultDashIsSupportedFactory().func()).toEqual(false)
    })

    it('when WebKitMediaSource return true', () => {
      // tslint:disable-next-line:no-object-mutation
      (window as any).MediaSource = undefined;
      // tslint:disable-next-line:no-object-mutation
      (window as any).WebKitMediaSource = () => {
        // noop
      }
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
