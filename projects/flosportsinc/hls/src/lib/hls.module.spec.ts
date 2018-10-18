import { HlsDirective } from './hls.directive'
import { defaultHlsSupportedNativelyFunction, defaultIsSupportedFactory } from './hls.module'
// import * as hls from 'hls.js'

describe(`${HlsDirective.name} default injection tokens`, () => {
  describe(`${defaultHlsSupportedNativelyFunction.name}`, () => {
    it('when default test environment', () => {
      const videElement = window.document.createElement('video')
      // const spy = jest.spyOn(videElement, 'canPlayType')
      const result = defaultHlsSupportedNativelyFunction()(videElement)
      // expect(spy).toHaveBeenCalledWith('application/vnd.apple.mpegurl')
      expect(result).toEqual(false)
    })

    it('when environment supports media source extensions', () => {
      const videElement = window.document.createElement('video')
      // const spy = jest.spyOn(videElement, 'canPlayType')
      // spy.mockReturnValue(true)
      const result = defaultHlsSupportedNativelyFunction()(videElement)
      // expect(spy).toHaveBeenCalledWith('application/vnd.apple.mpegurl')
      expect(result).toEqual(true)
    })
  })

  describe(`${defaultIsSupportedFactory.name}`, () => {
    it('when default test environment', () => {
      // const spy = jest.spyOn(hls, 'isSupported')
      const result = defaultIsSupportedFactory()
      expect(result).toEqual(false)
      expect(typeof result === 'boolean').toEqual(true)
      // expect(spy).toHaveBeenCalled()
    })
    it('when environment supports media source extensions', () => {
      const videElement = window.document.createElement('video')
      // const spy = jest.spyOn(hls, 'isSupported')
      // spy.mockReturnValue(true)
      const result = defaultHlsSupportedNativelyFunction()(videElement)
      expect(result).toEqual(false)
    })
  })
})
