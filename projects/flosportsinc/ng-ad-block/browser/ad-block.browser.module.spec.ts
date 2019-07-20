import { TestBed } from '@angular/core/testing'
import { NgModule } from '@angular/core'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { FloAdBlockBrowserModule } from './ad-block.browser.module'
import { AdBlockService } from '@flosportsinc/ng-ad-block'
import { take } from 'rxjs/operators'

@NgModule({
  imports: [
    HttpClientTestingModule,
    FloAdBlockBrowserModule.usingUrl('http://mysite.com/ads.js')
  ]
})
export class AdBlockBrowserTestModule { }

const getService = () => TestBed.get(AdBlockService) as AdBlockService
const getHttpMock = () => TestBed.get(HttpTestingController as any) as HttpTestingController

describe(FloAdBlockBrowserModule.name, () => {
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
