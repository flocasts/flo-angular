import { TestBed } from '@angular/core/testing'
import { NgModule, Type } from '@angular/core'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { AdBlockBrowserModule } from './ad-block.browser.module'
import { AdBlockService } from '@flosportsinc/ng-ad-block'
import { take } from 'rxjs/operators'

@NgModule({
  imports: [
    HttpClientTestingModule,
    AdBlockBrowserModule.usingUrl('http://mysite.com/ads.js')
  ]
})
export class AdBlockBrowserTestModule { }

const getService = () => TestBed.get(AdBlockService) as AdBlockService
const getHttpMock = () => TestBed.get<Type<HttpTestingController>>(HttpTestingController as any) as HttpTestingController

describe(AdBlockBrowserModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdBlockBrowserTestModule]
    })
  })

  it('should construct', () => {
    getService().isAnAdBlockerActive().pipe(take(1)).subscribe(res => {
      expect(res).toEqual(true)
    })
    const mock = getHttpMock().expectOne('http://mysite.com/ads.js')
    mock.error({} as any)
  })

  it('should return false when http request returns success', () => {
    getService().isAnAdBlockerActive().pipe(take(1)).subscribe(res => {
      expect(res).toEqual(false)
    })
    const mock = getHttpMock().expectOne('http://mysite.com/ads.js')
    mock.flush({})
  })
})
