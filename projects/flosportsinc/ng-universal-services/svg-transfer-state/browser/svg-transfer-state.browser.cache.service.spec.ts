import { TestBed } from '@angular/core/testing'
import { SVG_LOADER_BROWSER_CACHE } from './svg-transfer-state.tokens'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { SvgTransferStateBrowserModule, SvgTransferStateBrowserModuleConfig } from './svg-transfer-state.browser.module'
import { SvgBrowserLoaderCacheService } from './svg-transfer-state.browser.cache.service'
import { ISvgLoaderBrowserCacheService } from './svg-transfer-state.interfaces'

const setupTb = (config?: Partial<SvgTransferStateBrowserModuleConfig>) => {
  TestBed.configureTestingModule({
    providers: [
    ],
    imports: [
      HttpClientTestingModule,
      SvgTransferStateBrowserModule.withConfig(config)
    ]
  })
}

const getSut = () => TestBed.get(SVG_LOADER_BROWSER_CACHE) as ISvgLoaderBrowserCacheService

describe(SvgBrowserLoaderCacheService.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  describe('session cache', () => {
    beforeEach(() => setupTb())

    it('should construct', () => {
      expect(getSut()).toBeDefined()
    })

    it('should get', () => {
      const sut = getSut()
      const spy = spyOn(sessionStorage, 'getItem')

      sut.get('icon')

      expect(spy).toHaveBeenCalledWith('icon')
    })

    it('should set', () => {
      const sut = getSut()
      const spy = spyOn(sessionStorage, 'setItem')

      sut.set('icon', '<svg></svg>')

      expect(spy).toHaveBeenCalledWith('icon', '<svg></svg>')
    })

    it('should return undefined if sessionStorage is unavailable', () => {
      const sut = getSut()
      spyOn(sessionStorage, 'getItem').and.throwError('')

      expect(sut.get('icon')).toBe(undefined)
    })
  })

  describe('local cache', () => {
    beforeEach(() => setupTb({ cacheMaxAge: 1 }))

    it('should construct', () => {
      expect(getSut()).toBeDefined()
    })

    it('should get', () => {
      const sut = getSut()
      const spy = spyOn(localStorage, 'getItem')

      sut.get('icon')
      expect(spy).toHaveBeenCalledWith('icon')
    })

    it('should set', () => {
      const sut = getSut()
      const spy = spyOn(localStorage, 'setItem')

      sut.set('icon', '<svg></svg>')

      const str = JSON.stringify({ value: '<svg></svg>', ts: Date.now() })

      expect(spy).toHaveBeenCalledWith('icon', str)
    })

    it('should return undefined if localStorage is unavailable', () => {
      const sut = getSut()
      spyOn(localStorage, 'getItem').and.throwError('')

      expect(sut.get('icon')).toBe(undefined)
    })

    it('should return undefined if cache expired', () => {
      const sut = getSut()

      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({
        value: 'svg',
        ts: 0
      }))

      expect(sut.get('icon')).toBe(undefined)
    })
  })
})
