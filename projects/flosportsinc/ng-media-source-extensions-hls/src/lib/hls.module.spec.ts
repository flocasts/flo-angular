import {
  HlsModule, defaultHlsSupportedNativelyFunction, defaultIsSupportedFactory,
  defaultMseClientSrcChangeFunction
} from './hls.module'
import { TestBed } from '@angular/core/testing'
import * as Hls from 'hls.js'
import { IMseSrcChangeOptions } from '@flosportsinc/ng-media-source-extensions'

describe(HlsModule.name, () => {
  it('should construct', () => {
    TestBed.configureTestingModule({
      imports: [HlsModule]
    })
  })
  describe(`exposed ${defaultHlsSupportedNativelyFunction.name} factory function`, () => {
    it('when default test environment (no native support)', () => {
      const videElement = window.document.createElement('video')
      const spy = spyOn(videElement, 'canPlayType')
      const result = defaultHlsSupportedNativelyFunction().func(videElement)
      expect(spy).toHaveBeenCalledWith('application/vnd.apple.mpegurl')
      expect(result).toEqual(false)
    })

    it('when both are supported, default to MSE library over native', () => {
      const videElement = window.document.createElement('video')
      spyOn(videElement, 'canPlayType').and.returnValue(true)
      spyOn(Hls, 'isSupported').and.returnValue(true)
      const result = defaultHlsSupportedNativelyFunction().func(videElement)
      expect(result).toEqual(false)
    })

    it('when environment supports media source extensions only', () => {
      const videElement = window.document.createElement('video')
      spyOn(videElement, 'canPlayType').and.returnValue(false)
      spyOn(Hls, 'isSupported').and.returnValue(true)
      const result = defaultHlsSupportedNativelyFunction().func(videElement)
      expect(result).toEqual(false)
    })

    it('when environment only supports native (iOS safari, for example)', () => {
      const videElement = window.document.createElement('video')
      spyOn(videElement, 'canPlayType').and.returnValue(true)
      spyOn(Hls, 'isSupported').and.returnValue(false)
      const result = defaultHlsSupportedNativelyFunction().func(videElement)
      expect(result).toEqual(true)
    })
  })

  describe(`exposed ${defaultIsSupportedFactory.name} function`, () => {
    it('when default test environment', () => {
      expect(defaultIsSupportedFactory().func()).toEqual(true)
    })
    it('when hlsjs not supported', () => {
      spyOn(Hls, 'isSupported').and.returnValue(false)
      expect(defaultIsSupportedFactory().func()).toEqual(false)
    })
  })

  describe(`exposed ${defaultMseClientSrcChangeFunction.name} factory function`, () => {
    it('should reset HLS client with new source', () => {
      const videoElement = document.createElement('video')
      const event: IMseSrcChangeOptions<Hls> = { clientRef: new Hls(), src: '/new-url', videoElement }
      const spy1 = spyOn(event.clientRef, 'detachMedia')
      const spy2 = spyOn(event.clientRef, 'loadSource')
      const spy3 = spyOn(event.clientRef, 'attachMedia')
      defaultMseClientSrcChangeFunction().func(event)
      expect(spy1).toHaveBeenCalled()
      expect(spy2).toHaveBeenCalledWith(event.src)
      expect(spy3).toHaveBeenCalledWith(event.videoElement)
    })
  })
})
