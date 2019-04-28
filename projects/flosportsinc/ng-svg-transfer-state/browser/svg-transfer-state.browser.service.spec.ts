import { TestBed } from '@angular/core/testing'
import { SVG_LOADER } from './svg-transfer-state.tokens'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { SvgTransferStateBrowserModule, SvgTransferStateBrowserModuleConfig } from './svg-transfer-state.browser.module'
import { SvgBrowserLoaderCacheService } from './svg-transfer-state.browser.cache.service'
import { ISvgLoaderService } from './svg-transfer-state.interfaces'
import { SvgTransferStateModule } from '../common/svg-transfer-state.module'

export const setupCommonSvgTb = (config?: Partial<SvgTransferStateBrowserModuleConfig>) => {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      SvgTransferStateModule,
      SvgTransferStateBrowserModule.withConfig(config)
    ]
  })
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

    const http = TestBed.get(HttpTestingController as any) as HttpTestingController

    spyOn((sut as any)._cache, 'get').and.returnValue(undefined)

    sut.load('file').subscribe(val => {
      expect(val).toEqual('<svg></svg>')
    })

    http.expectOne('assets/svg/file.svg').flush('<svg></svg>')
  })

  it('should load server state cache', () => {
    const sut = getSut()

    const http = TestBed.get(HttpTestingController as any) as HttpTestingController

    spyOn((sut as any), '_getFromTransferCache').and.returnValue('<svg></svg>')

    sut.load('file').subscribe(val => {
      expect(val).toEqual('<svg></svg>')
    })

    http.expectNone('assets/svg/file.svg')
  })

  it('should load with cache', () => {
    const sut = getSut()

    const http = TestBed.get(HttpTestingController as any) as HttpTestingController

    spyOn((sut as any)._cache, 'get').and.returnValue('<svg></svg>')

    sut.load('file').subscribe(val => {
      expect(val).toEqual('<svg></svg>')
    })

    http.expectNone('assets/svg/file.svg')
  })
})
