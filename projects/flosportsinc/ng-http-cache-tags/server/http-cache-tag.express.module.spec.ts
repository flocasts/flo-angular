import { TestBed } from '@angular/core/testing'
import { HttpCacheTagInterceptor } from './http-cache-tag.interceptor'
import { FloHttpCacheTagExpressServerModule, immutableAppend } from './http-cache-tag.express.module'
import { RESPONSE } from '@nguniversal/express-engine/tokens'
import { IHttpCacheTagServerModuleConfig } from './http-cache-tag.module'
import {
  CACHE_TAG_WRITE_HEADER_FACTORY, IWriteResponseHeader,
  DEFAULT_CACHE_TAG_HEADER_KEY, CACHE_TAG_HEADER_KEY,
  DEFAULT_CACHE_TAG_DELIMITER, CACHE_TAG_DELIMITER,
  CACHE_TAG_RESPONSE_CODES, DEFAULT_CACHE_TAG_RESPONSE_CODES
} from './http-cache-tag.tokens'

describe(FloHttpCacheTagExpressServerModule.name, () => {
  afterEach(TestBed.resetTestingModule)

  const RESPONSE_PROVIDER = {
    provide: RESPONSE,
    useValue: {
      getHeader: (key: string) => {
        const dict = {
          [DEFAULT_CACHE_TAG_HEADER_KEY]: 'Video-1'
        }
        return dict[key]
      },
      header: () => { }
    }
  }

  const setupStandardTestBed = (config = {}) => TestBed.configureTestingModule({
    imports: [FloHttpCacheTagExpressServerModule.config(config)],
    providers: [RESPONSE_PROVIDER]
  })

  it('should construct with default values', () => {
    setupStandardTestBed()
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_HEADER_KEY)).toEqual(DEFAULT_CACHE_TAG_HEADER_KEY)
    expect(TestBed.get(CACHE_TAG_DELIMITER)).toEqual(DEFAULT_CACHE_TAG_DELIMITER)
    expect(TestBed.get(CACHE_TAG_RESPONSE_CODES)).toEqual(DEFAULT_CACHE_TAG_RESPONSE_CODES)
  })

  it('should construct with partial', () => {
    const config: Partial<IHttpCacheTagServerModuleConfig> = { }

    setupStandardTestBed(config)
    expect(TestBed.get(CACHE_TAG_RESPONSE_CODES)).toEqual(DEFAULT_CACHE_TAG_RESPONSE_CODES)
    expect(TestBed.get(CACHE_TAG_HEADER_KEY)).toEqual(DEFAULT_CACHE_TAG_HEADER_KEY)
    expect(TestBed.get(CACHE_TAG_DELIMITER)).toEqual(DEFAULT_CACHE_TAG_DELIMITER)
  })

  it('should construct with custom values', () => {
    const config: Partial<IHttpCacheTagServerModuleConfig> = {
      headerKey: 'E-Cache',
      cacheableResponseCodes: [202, 204]
    }

    setupStandardTestBed(config)
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_HEADER_KEY)).toEqual('E-Cache')
    expect(TestBed.get(CACHE_TAG_RESPONSE_CODES)).toEqual([202, 204])
  })

  it('should get express response header correcly', () => {
    setupStandardTestBed()

    const headerKey = TestBed.get(CACHE_TAG_HEADER_KEY)
    const res = TestBed.get(RESPONSE)
    const spy = spyOn(res, 'header')
    const headerWriter = TestBed.get(CACHE_TAG_WRITE_HEADER_FACTORY) as IWriteResponseHeader

    headerWriter(headerKey)('Video-2')(',')

    expect(spy).toHaveBeenCalledWith(DEFAULT_CACHE_TAG_HEADER_KEY, 'Video-1,Video-2')
  })

  it('should set express response headers', () => {
    setupStandardTestBed()

    const headerKey = TestBed.get(CACHE_TAG_HEADER_KEY)
    const res = TestBed.get(RESPONSE)
    const spy = spyOn(res, 'getHeader')
    const headerWriter = TestBed.get(CACHE_TAG_WRITE_HEADER_FACTORY) as IWriteResponseHeader

    headerWriter(headerKey)('Video-2')()
    expect(spy).toHaveBeenCalledWith(DEFAULT_CACHE_TAG_HEADER_KEY)
  })

  it('should set express response headers', () => {
    setupStandardTestBed()

    const headerKey = TestBed.get(CACHE_TAG_HEADER_KEY)
    const res = TestBed.get(RESPONSE)
    const spy = spyOn(res, 'getHeader')
    const headerWriter = TestBed.get(CACHE_TAG_WRITE_HEADER_FACTORY) as IWriteResponseHeader

    headerWriter(headerKey)('Video-2')('-')
    expect(spy).toHaveBeenCalledWith(DEFAULT_CACHE_TAG_HEADER_KEY)
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
