import { TestBed } from '@angular/core/testing'
import { AdBlockService } from './ad-block.service'
import { AdBlockBrowserModule } from './ad-block.browser.module'
import { AdBlockServerModule } from './ad-block.server.module'
import { NgModule } from '@angular/core'
import { take } from 'rxjs/operators'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

@NgModule({
  imports: [
    HttpClientTestingModule,
    AdBlockBrowserModule.usingUrl('http://mysite.com/ads.js')
  ]
})
export class AdBlockBrowserTestModule { }

@NgModule({
  imports: [
    HttpClientTestingModule,
    AdBlockServerModule
  ]
})
export class AdBlockServerTestModule { }


const getService = () => TestBed.get(AdBlockService) as AdBlockService
const getHttpMock = () => TestBed.get(HttpTestingController) as HttpTestingController

describe('Ad-Block Module', () => {
  afterEach(() => TestBed.resetTestingModule())

  describe('when on server platform', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AdBlockServerTestModule]
      })
    })
    it('should not run GET request and always return false', () => {
      getService().isAnAdBlockerActive().pipe(take(1)).subscribe(res => {
        expect(res).toEqual(false)
      })
      getHttpMock().expectNone('http://mysite.com/ads.js')
    })
  })
  describe('when on browser platform', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AdBlockBrowserTestModule]
      })
    })
    it('should return true when http request is blocked', () => {
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
})
