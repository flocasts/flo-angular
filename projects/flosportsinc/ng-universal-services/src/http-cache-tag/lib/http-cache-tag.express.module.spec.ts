import { TestBed } from '@angular/core/testing'
import { HttpCacheTagInterceptor } from './http-cache-tag.interceptor'
import { HttpCacheTagExpressServerModule, DEFAULT_EXPRESS_WRITE_HEADER_FACTORY, immutableAppend } from './http-cache-tag.express.module'
import { CACHE_TAG_CONFIG, CACHE_TAG_WRITE_HEADER_FACTORY, IWriteResponseHeader, ICacheTagConfig } from './http-cache-tag.tokens'
import { DEFAULT_CACHE_TAG_CONFIGURATION } from './http-cache-tag.module'
import { RESPONSE } from '@nguniversal/express-engine/tokens'

describe(HttpCacheTagExpressServerModule.name, () => {
  afterEach(TestBed.resetTestingModule)

  const setupStandardTestBed = (config = {}) => TestBed.configureTestingModule({
    imports: [HttpCacheTagExpressServerModule.withConfig(config)],
    providers: [RESPONSE_PROVIDER]
  })

  const RESPONSE_PROVIDER = {
    provide: RESPONSE,
    useValue: {
      getHeader: (key: string) => {
        const dict = {
          [DEFAULT_CACHE_TAG_CONFIGURATION.headerKey]: 'Video-1'
        }
        return dict[key]
      },
      header: () => { }
    }
  }

  it('should construct with default values', () => {
    setupStandardTestBed()
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_CONFIG)).toEqual(DEFAULT_CACHE_TAG_CONFIGURATION)
  })

  it('should construct withConfig empty', () => {
    setupStandardTestBed()
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_CONFIG)).toEqual(DEFAULT_CACHE_TAG_CONFIGURATION)
  })

  it('should construct with custom values', () => {
    const config: Partial<ICacheTagConfig> = {
      headerKey: 'E-Cache',
      cacheableResponseCodes: [202, 204]
    }

    setupStandardTestBed(config)
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_CONFIG)).toEqual({
      ...DEFAULT_CACHE_TAG_CONFIGURATION,
      ...config
    })
  })

  it('should get express response header correcly', () => {
    setupStandardTestBed()

    const config = TestBed.get(CACHE_TAG_CONFIG) as ICacheTagConfig
    const res = TestBed.get(RESPONSE)
    const spy = spyOn(res, 'header')
    const headerWriter = TestBed.get(CACHE_TAG_WRITE_HEADER_FACTORY) as IWriteResponseHeader

    headerWriter(config.headerKey)('Video-2')(',')

    expect(spy).toHaveBeenCalledWith(DEFAULT_CACHE_TAG_CONFIGURATION.headerKey, 'Video-1,Video-2')
  })

  it('should set express response headers', () => {
    setupStandardTestBed()

    const config = TestBed.get(CACHE_TAG_CONFIG) as ICacheTagConfig
    const res = TestBed.get(RESPONSE)
    const spy = spyOn(res, 'getHeader')
    const headerWriter = TestBed.get(CACHE_TAG_WRITE_HEADER_FACTORY) as IWriteResponseHeader

    headerWriter(config.headerKey)('Video-2')()
    expect(spy).toHaveBeenCalledWith(DEFAULT_CACHE_TAG_CONFIGURATION.headerKey)
  })

  it('should set express response headers', () => {
    setupStandardTestBed()

    const config = TestBed.get(CACHE_TAG_CONFIG) as ICacheTagConfig
    const res = TestBed.get(RESPONSE)
    const spy = spyOn(res, 'getHeader')
    const headerWriter = TestBed.get(CACHE_TAG_WRITE_HEADER_FACTORY) as IWriteResponseHeader

    headerWriter(config.headerKey)('Video-2')('-')
    expect(spy).toHaveBeenCalledWith(DEFAULT_CACHE_TAG_CONFIGURATION.headerKey)
  })

  it('should append strings correctly', () => {
    const appended = immutableAppend('test,this,out')()('word')
    expect(appended).toEqual('test,this,out,word')
  })

  it('should append strings correctly with another delimitter', () => {
    const appended = immutableAppend('test-this-out')('-')('word')
    expect(appended).toEqual('test-this-out-word')
  })

  it('should append strings correctly with stray delimitter', () => {
    const appended = immutableAppend('test,this,out,')()('word')
    expect(appended).toEqual('test,this,out,word')
  })

  it('should append strings correctly with duplicate delimitter', () => {
    const appended = immutableAppend('test,this,,out')()('word')
    expect(appended).toEqual('test,this,out,word')
  })

  it('should append strings correctly with empty input', () => {
    const appended = immutableAppend('test,this,,out,')()('')
    expect(appended).toEqual('test,this,out')
  })
})
