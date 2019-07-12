import { TestBed } from '@angular/core/testing'
import { COOKIE_SERVICE, ICookieService } from '@flosportsinc/ng-universal-services/cookies'
import { CookieBrowserModule } from './cookie.browser.module'
import * as jsCookie from 'js-cookie'

const setupTb = () => {
  TestBed.configureTestingModule({
    imports: [CookieBrowserModule]
  })
}

describe(CookieBrowserModule.name, () => {
  beforeEach(setupTb)
  afterEach(() => TestBed.resetTestingModule())

  it('should ...', () => {
    const service = TestBed.get(COOKIE_SERVICE) as ICookieService
    expect(service).toBeTruthy()
  })

  it('should implement set() function', () => {
    const sut = TestBed.get(COOKIE_SERVICE) as ICookieService
    const setFuncSpy0 = spyOn(jsCookie, 'set').and.callThrough()
    const setFuncSpy1 = spyOn((sut as any)._cookieSource, 'next').and.callThrough()
    const setFuncSpy2 = spyOn((sut as any)._changeSource, 'next').and.callThrough()

    sut.set('test', 1)

    expect(setFuncSpy0).toHaveBeenCalledWith('test', 1, undefined)
    expect(setFuncSpy1).toHaveBeenCalled()
    expect(setFuncSpy2).toHaveBeenCalledWith({ key: 'test', value: 1 })
  })

  it('should implement remove() function', () => {
    const sut = TestBed.get(COOKIE_SERVICE) as ICookieService
    const setFuncSpy0 = spyOn(jsCookie, 'remove').and.callThrough()
    const setFuncSpy1 = spyOn((sut as any)._cookieSource, 'next').and.callThrough()
    const setFuncSpy2 = spyOn((sut as any)._changeSource, 'next').and.callThrough()
    const setFuncSpy3 = spyOn(jsCookie, 'getJSON').and.callThrough()

    sut.remove('test')

    expect(setFuncSpy0).toHaveBeenCalledWith('test', undefined)
    expect(setFuncSpy1).toHaveBeenCalled()
    expect(setFuncSpy2).toHaveBeenCalledWith({ key: 'test', value: undefined })
    expect(setFuncSpy3).toHaveBeenCalled()
  })

  it('should', () => {
    const sut = TestBed.get(COOKIE_SERVICE) as ICookieService
    const example = { cool: 1 }
    sut.targetValueChange('thing').subscribe(res => {
      expect(res.key).toEqual('thing')
      expect(res.value).toEqual(example)
    })

    sut.set('thing', example)
  })
})
