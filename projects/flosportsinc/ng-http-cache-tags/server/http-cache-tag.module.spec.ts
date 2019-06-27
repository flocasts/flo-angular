import { TestBed } from '@angular/core/testing'
import { HttpCacheTagInterceptor } from './http-cache-tag.interceptor'
import { FloHttpCacheTagServerModule, IHttpCacheTagServerModuleConfig } from './http-cache-tag.module'
import {
  CACHE_TAG_WRITE_HEADER_FACTORY, CACHE_TAG_RESPONSE_CODES,
  DEFAULT_CACHE_TAG_RESPONSE_CODES, CACHE_TAG_HEADER_KEY,
  DEFAULT_CACHE_TAG_HEADER_KEY, CACHE_TAG_DELIMITER,
  DEFAULT_CACHE_TAG_DELIMITER
} from './http-cache-tag.tokens'

describe(FloHttpCacheTagServerModule.name, () => {
  afterEach(TestBed.resetTestingModule)

  it('should construct with default values', () => {
    TestBed.configureTestingModule({
      imports: [FloHttpCacheTagServerModule]
    })
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_RESPONSE_CODES)).toEqual(DEFAULT_CACHE_TAG_RESPONSE_CODES)
    expect(TestBed.get(CACHE_TAG_HEADER_KEY)).toEqual(DEFAULT_CACHE_TAG_HEADER_KEY)
    expect(TestBed.get(CACHE_TAG_DELIMITER)).toEqual(DEFAULT_CACHE_TAG_DELIMITER)
    expect(TestBed.get(CACHE_TAG_WRITE_HEADER_FACTORY)()()()).toBeUndefined()
  })

  it('should construct with custom values', () => {
    const config: Partial<IHttpCacheTagServerModuleConfig> = {
      headerKey: 'X-Cache',
      cacheableResponseCodes: [100],
      delimiter: '-'
    }
    TestBed.configureTestingModule({
      imports: [FloHttpCacheTagServerModule.config(config)]
    })
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_HEADER_KEY)).toEqual('X-Cache')
    expect(TestBed.get(CACHE_TAG_DELIMITER)).toEqual('-')
    expect(TestBed.get(CACHE_TAG_RESPONSE_CODES)).toEqual([100])
  })

  it('should construct with partial', () => {
    const config: Partial<IHttpCacheTagServerModuleConfig> = { }
    TestBed.configureTestingModule({
      imports: [FloHttpCacheTagServerModule.config(config)]
    })
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_RESPONSE_CODES)).toEqual(DEFAULT_CACHE_TAG_RESPONSE_CODES)
    expect(TestBed.get(CACHE_TAG_HEADER_KEY)).toEqual(DEFAULT_CACHE_TAG_HEADER_KEY)
    expect(TestBed.get(CACHE_TAG_DELIMITER)).toEqual(DEFAULT_CACHE_TAG_DELIMITER)
  })
})

