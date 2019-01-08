import { TestBed } from '@angular/core/testing'
import { HttpCacheTagInterceptor } from './http-cache-tag.interceptor'
import { HttpCacheTagExpressServerModule, DEFAULT_EXPRESS_WRITE_HEADER_FACTORY } from './http-cache-tag.express.module'
import { CACHE_TAG_CONFIG, CACHE_TAG_WRITE_HEADER_FACTORY } from './http-cache-tag.tokens'
import { DEFAULT_CACHE_TAG_CONFIGURATION } from './http-cache-tag.module'
import { RESPONSE } from '@nguniversal/express-engine/tokens'
import { Injector } from '@angular/core'

describe(HttpCacheTagExpressServerModule.name, () => {
  afterEach(TestBed.resetTestingModule)

  const RESPONSE_PROVIDER = {
    provide: RESPONSE,
    useValue: {
      getHeader: () => 1,
      header: () => ''
    }
  }

  it('should construct with default values', () => {
    TestBed.configureTestingModule({
      imports: [HttpCacheTagExpressServerModule],
      providers: [RESPONSE_PROVIDER]
    })
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_CONFIG)).toEqual(DEFAULT_CACHE_TAG_CONFIGURATION)
  })

  it('should construct withConfig empty', () => {
    TestBed.configureTestingModule({
      imports: [HttpCacheTagExpressServerModule.withConfig()],
      providers: [RESPONSE_PROVIDER]
    })
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_CONFIG)).toEqual(DEFAULT_CACHE_TAG_CONFIGURATION)
  })

  it('should construct with custom values', () => {
    const config = {
      headerKey: 'E-Cache',
      cacheableResponseCodes: [202, 204]
    }
    TestBed.configureTestingModule({
      imports: [HttpCacheTagExpressServerModule.withConfig(config)],
      providers: [RESPONSE_PROVIDER]
    })
    expect(TestBed.get(HttpCacheTagInterceptor)).toBeTruthy()
    expect(TestBed.get(CACHE_TAG_CONFIG)).toEqual(config)
  })

  it('should append headers correctly', () => {
    //
  })
})
