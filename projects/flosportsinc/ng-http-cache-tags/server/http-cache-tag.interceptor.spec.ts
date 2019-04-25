import { HttpCacheTagInterceptor } from './http-cache-tag.interceptor'
import { TestBed } from '@angular/core/testing'
import { HttpCacheTagExpressServerModule } from './http-cache-tag.express.module'
import { DEFAULT_CACHE_TAG_CONFIGURATION } from './http-cache-tag.module'
import { RESPONSE } from '@nguniversal/express-engine/tokens'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { ICacheTagConfig } from './http-cache-tag.tokens'

describe(HttpCacheTagInterceptor.name, () => {
  afterEach(TestBed.resetTestingModule)

  const createReponseProvider = (dict = { [DEFAULT_CACHE_TAG_CONFIGURATION.headerKey]: 'Video-1' }) => {
    return {
      provide: RESPONSE,
      useValue: {
        getHeader: (key: string) => dict[key],
        header: () => { }
      }
    }
  }

  const setupStandardTestBed = (config: Partial<ICacheTagConfig> = {}) => (dict?: any) => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      HttpClientTestingModule,
      HttpCacheTagExpressServerModule.withConfig(config)
    ],
    providers: [createReponseProvider()]
  })

  const createTestBed = () => setupStandardTestBed()()

  const httpTestHelpers = () => {
    return {
      http: TestBed.get(HttpClient) as HttpClient,
      httpMock: TestBed.get<HttpTestingController>(HttpTestingController as any) as HttpTestingController
    }
  }

  it('should handle default case ', () => {
    createTestBed()

    const helpers = httpTestHelpers()
    const response = TestBed.get(RESPONSE)
    const responseSpy = spyOn(response, 'header')

    const url = 'http://some-cool-app/api/video/1'
    const headerKey = DEFAULT_CACHE_TAG_CONFIGURATION.headerKey
    const sampleResponseBody = { id: 1, videoName: 'puppy laughs ' }
    const sampleResponse = { headers: { [headerKey]: 'Video-1' }, status: 200, statusText: 'success' }

    helpers.http.get(url, { observe: 'response' }).subscribe(
      res => {
        expect(res.headers.get(headerKey)).toEqual('Video-1')
        expect(responseSpy).toHaveBeenCalledWith('Cache-Tag', 'Video-1')
      },
      _err => expect(false).toEqual(true)
    )

    helpers.httpMock
      .expectOne(r => r.url === url)
      .flush(sampleResponseBody, sampleResponse)

    helpers.httpMock.verify()
  })

  it('should not set cache headers when status code is out of range ', () => {
    createTestBed()

    const helpers = httpTestHelpers()
    const response = TestBed.get(RESPONSE)
    const responseSpy = spyOn(response, 'header')

    const url = 'http://some-cool-app/api/video/1'
    const headerKey = DEFAULT_CACHE_TAG_CONFIGURATION.headerKey
    const sampleResponseBody = { id: 1, videoName: 'puppy laughs ' }
    const sampleResponse = { headers: { [headerKey]: 'Video-1' }, status: 202, statusText: 'success' }

    helpers.http.get(url, { observe: 'response' }).subscribe(
      res => {
        expect(res.headers.get(headerKey)).toEqual('Video-1')
        expect(responseSpy).not.toHaveBeenCalled()
      },
      _err => expect(false).toEqual(true)
    )

    helpers.httpMock
      .expectOne(r => r.url === url)
      .flush(sampleResponseBody, sampleResponse)

    helpers.httpMock.verify()
  })

  it('should handle empty header from http client', () => {
    createTestBed()

    const helpers = httpTestHelpers()
    const response = TestBed.get(RESPONSE)
    const responseSpy = spyOn(response, 'header')

    const url = 'http://some-cool-app/api/video/1'
    const headerKey = DEFAULT_CACHE_TAG_CONFIGURATION.headerKey
    const sampleResponseBody = { id: 1, videoName: 'puppy laughs ' }
    const sampleResponse = { headers: {}, status: 200, statusText: 'success' }

    helpers.http.get(url, { observe: 'response' }).subscribe(
      res => {
        expect(res.headers.get(headerKey)).toBeNull()
        expect(responseSpy).not.toHaveBeenCalled()
      },
      _err => expect(false).toEqual(true)
    )

    helpers.httpMock
      .expectOne(r => r.url === url)
      .flush(sampleResponseBody, sampleResponse)

    helpers.httpMock.verify()
  })

  it('should handle empty response code config', () => {
    setupStandardTestBed({
      cacheableResponseCodes: undefined
    })()

    const helpers = httpTestHelpers()
    const response = TestBed.get(RESPONSE)
    const responseSpy = spyOn(response, 'header')

    const url = 'http://some-cool-app/api/video/1'
    const headerKey = DEFAULT_CACHE_TAG_CONFIGURATION.headerKey
    const sampleResponseBody = { id: 1, videoName: 'puppy laughs ' }
    const sampleResponse = { headers: {}, status: 202, statusText: 'success' }

    helpers.http.get(url, { observe: 'response' }).subscribe(
      res => {
        const header = res.headers.get(headerKey)
        expect(header).toBeNull()
        expect(responseSpy).not.toHaveBeenCalled()
      },
      _err => expect(false).toEqual(true)
    )

    helpers.httpMock
      .expectOne(r => r.url === url)
      .flush(sampleResponseBody, sampleResponse)

    helpers.httpMock.verify()
  })
})

