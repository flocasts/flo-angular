import { TestBed } from '@angular/core/testing'
import { HttpCacheTagInterceptor } from './http-cache-tag.interceptor'
import { HttpCacheTagServerModule, DEFAULT_CACHE_TAG_CONFIGURATION } from './http-cache-tag.module'
import { CACHE_TAG_CONFIG, CACHE_TAG_WRITE_HEADER_FACTORY } from './http-cache-tag.tokens'

describe(HttpCacheTagServerModule.name, () => {
  afterEach(TestBed.resetTestingModule)

  it('should construct with default values', () => {
    TestBed.configureTestingModule({
      imports: [HttpCacheTagServerModule]
    })
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_CONFIG)).toEqual(DEFAULT_CACHE_TAG_CONFIGURATION)
    expect(TestBed.get(CACHE_TAG_WRITE_HEADER_FACTORY)()()()).toBeUndefined()
  })

  it('should construct withConfig empty', () => {
    TestBed.configureTestingModule({
      imports: [HttpCacheTagServerModule.withConfig()]
    })
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_CONFIG)).toEqual(DEFAULT_CACHE_TAG_CONFIGURATION)
  })

  it('should construct with custom values', () => {
    const config = {
      headerKey: 'X-Cache',
      cacheableResponseCodes: [100]
    }
    TestBed.configureTestingModule({
      imports: [HttpCacheTagServerModule.withConfig(config)]
    })
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_CONFIG)).toEqual(config)
  })
})

