import { TestBed } from '@angular/core/testing'
import {
  SVG_DIRECTIVE_DEFAULT_STYLES, SVG_DIRECTIVE_PARENT_STYLE_KEYS, SVG_REQUEST_PATTERN,
  SVG_REQUEST_PATTERN_BASE,
  SVG_LOADER_ERROR_RETURN_OPERATOR,
  SVG_LOADER_HTTP_REQUEST
} from './svg-transfer-state.tokens'
import {
  SvgTransferStateModule, ISvgTransferStateModuleConfigParams,
  DEFAULT_PARENT_STYLE_KEYS, DEFAULT_STYLES
} from './svg-transfer-state.module'
import { ISvgRequestPatternFunc, ISvgLoaderErrorReturnValueStreamFunc } from './svg-transfer-state.interfaces'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { HttpClientModule } from '@angular/common/http'

const getHttpMock = () => TestBed.get(HttpTestingController) as HttpTestingController

const setupTb = (config?: Partial<ISvgTransferStateModuleConfigParams>) => {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: SVG_REQUEST_PATTERN_BASE,
        useValue: '/root/path/test'
      }
    ],
    imports: [
      HttpClientModule,
      HttpClientTestingModule,
      SvgTransferStateModule.config(config)
    ]
  })
}

const expectDefaults = () => {
  const defaultStyles = TestBed.get(SVG_DIRECTIVE_DEFAULT_STYLES)
  const defaultParentStyleKeys = TestBed.get(SVG_DIRECTIVE_PARENT_STYLE_KEYS)

  expect(defaultStyles).toEqual(DEFAULT_STYLES)
  expect(defaultParentStyleKeys).toEqual(DEFAULT_PARENT_STYLE_KEYS)
}

describe(SvgTransferStateModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  it('should init module without .config() being called ', () => {
    setupTb()
    expectDefaults()
  })

  it('should init module with .config() being called empty', () => {
    setupTb({})
    expectDefaults()
  })

  it('should init module with .config() being called', () => {
    const styles = { height: '1px' }
    const parentStyleKeys: ReadonlyArray<any> = ['test']

    setupTb({ styles, parentStyleKeys })

    const defaultStyles = TestBed.get(SVG_DIRECTIVE_DEFAULT_STYLES)
    const defaultParentStyleKeys = TestBed.get(SVG_DIRECTIVE_PARENT_STYLE_KEYS)

    expect(defaultStyles).toEqual(styles)
    expect(defaultParentStyleKeys).toEqual(parentStyleKeys)
  })

  it('should init module with .config() being called partially', () => {
    const styles = { height: '1px' }

    setupTb({ styles })

    const defaultStyles = TestBed.get(SVG_DIRECTIVE_DEFAULT_STYLES)
    const defaultParentStyleKeys = TestBed.get(SVG_DIRECTIVE_PARENT_STYLE_KEYS)

    expect(defaultStyles).toEqual(styles)
    expect(defaultParentStyleKeys).toEqual(DEFAULT_PARENT_STYLE_KEYS)
  })


  it('should have default http request pattern', () => {
    setupTb()
    const reqPattern = TestBed.get(SVG_REQUEST_PATTERN) as ISvgRequestPatternFunc
    const patternResultRelative = reqPattern('some-file-key')
    const patternResultExternal = reqPattern('https://some-file-key.svg')

    expect(patternResultRelative).toEqual('/root/path/test/some-file-key.svg')
    expect(patternResultExternal).toEqual('https://some-file-key.svg')
  })

  it('should have default svg loader error return operator', () => {
    setupTb()

    const reqPattern = TestBed.get(SVG_LOADER_ERROR_RETURN_OPERATOR) as ISvgLoaderErrorReturnValueStreamFunc

    const spy = spyOn(console, 'log')

    reqPattern({ message: 'test error' }).subscribe(v => {
      expect(v).toBeUndefined()
      expect(spy).toHaveBeenCalledWith('test error')
    })
  })

  it('should support default http request', () => {
    setupTb()
    const reqPattern = TestBed.get(SVG_LOADER_HTTP_REQUEST) as any

    reqPattern('http://some.svg').subscribe(res => {
      expect(res).toEqual('<svg></svg>')
    })

    getHttpMock()
      .expectOne('http://some.svg')
      .flush('<svg></svg>')
  })

  it('should support default http request error', () => {
    setupTb()
    const reqPattern = TestBed.get(SVG_LOADER_HTTP_REQUEST) as any

    reqPattern('http://some.svg').subscribe(res => {
      expect(res).toBeUndefined()
    })

    getHttpMock()
      .expectOne('http://some.svg')
      .error(undefined as any, { status: 500, statusText: 'error ' })
  })
})
