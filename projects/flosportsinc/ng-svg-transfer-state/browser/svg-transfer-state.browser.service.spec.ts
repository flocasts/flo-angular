import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { SvgTransferStateBrowserModule, SvgTransferStateBrowserModuleConfig } from './svg-transfer-state.browser.module'
import { SvgBrowserLoaderCacheService } from './svg-transfer-state.browser.cache.service'
import { SvgTransferStateModule, SVG_LOADER, ISvgLoaderService } from '@flosportsinc/ng-svg-transfer-state'
import { Type } from '@angular/core';

export const setupCommonSvgTb = (config?: Partial<SvgTransferStateBrowserModuleConfig>) => {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      SvgTransferStateModule,
      SvgTransferStateBrowserModule.withConfig(config)
    ]
  }).compileComponents()
}

const getSut = () => TestBed.get(SVG_LOADER) as ISvgLoaderService

describe(SvgBrowserLoaderCacheService.name, () => {
  beforeEach(() => setupCommonSvgTb())
  afterEach(() => TestBed.resetTestingModule())

  it('should construct', () => {
    expect(getSut()).toBeDefined()
  })

  it('should load without cache', () => {
    const sut = getSut()

    const http = TestBed.get<Type<HttpTestingController>>(HttpTestingController as any) as HttpTestingController

    spyOn((sut as any)._cache, 'get').and.returnValue(undefined)

    sut.load('file').subscribe(val => {
      expect(val).toEqual('<svg></svg>')
    })

    http.expectOne('assets/svg/file.svg').flush('<svg></svg>')
  })

  it('should load server state cache', () => {
    const sut = getSut()

    const http = TestBed.get<Type<HttpTestingController>>(HttpTestingController as any) as HttpTestingController

    spyOn((sut as any), '_getFromTransferCache').and.returnValue('<svg></svg>')

    sut.load('file').subscribe(val => {
      expect(val).toEqual('<svg></svg>')
    })

    http.expectNone('assets/svg/file.svg')
  })

  it('should load with cache', () => {
    const sut = getSut()

    const http = TestBed.get<Type<HttpTestingController>>(HttpTestingController as any) as HttpTestingController

    spyOn((sut as any)._cache, 'get').and.returnValue('<svg></svg>')

    sut.load('file').subscribe(val => {
      expect(val).toEqual('<svg></svg>')
    })

    http.expectNone('assets/svg/file.svg')
  })
})
