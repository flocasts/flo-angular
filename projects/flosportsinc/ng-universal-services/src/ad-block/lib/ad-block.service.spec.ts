import { TestBed } from '@angular/core/testing'
import { AdBlockService } from './ad-block.service'
import { AdBlockModule } from './ad-block.module'
import { NgModule, PLATFORM_ID } from '@angular/core'
import { take } from 'rxjs/operators'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

@NgModule({
  imports: [
    HttpClientTestingModule,
    AdBlockModule.withTestUrl('http://mysite.com/ads.js')
  ]
})
export class AdBlockTestModule { }

const getService = () => TestBed.get(AdBlockService) as AdBlockService
const getHttpMock = () => TestBed.get(HttpTestingController) as HttpTestingController

describe(AdBlockService.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  describe('when on server platform', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AdBlockTestModule],
        providers: [{
          provide: PLATFORM_ID,
          useValue: 'server'
        }]
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
        imports: [AdBlockTestModule],
        providers: [{
          provide: PLATFORM_ID,
          useValue: 'browser'
        }]
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
