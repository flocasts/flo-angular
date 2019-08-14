import { Inject, Injectable } from '@angular/core'
import { filter, tap, share } from 'rxjs/operators'
import { Observable, merge } from 'rxjs'
import {
  CACHE_TAG_WRITE_HEADER_FACTORY, IWriteResponseHeader,
  CACHE_TAG_RESPONSE_CODES, CACHE_TAG_HEADER_KEY, CACHE_TAG_DELIMITER
} from './http-cache-tag.tokens'
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpEvent
} from '@angular/common/http'

@Injectable()
export class HttpCacheTagInterceptor implements HttpInterceptor {
  constructor(
    // tslint:disable-next-line:readonly-array
    @Inject(CACHE_TAG_RESPONSE_CODES) private cacheableResponseCodes: number[],
    @Inject(CACHE_TAG_HEADER_KEY) private headerKey: string,
    @Inject(CACHE_TAG_DELIMITER) private tagDelimiter: string,
    @Inject(CACHE_TAG_WRITE_HEADER_FACTORY) private factory: IWriteResponseHeader
  ) { }

  readonly isCacheableResponseCode = (code: number) => this.cacheableResponseCodes.find(a => a === code) ? true : false

  readonly isHttpResponseEvent =
    <T>(httpEvent: HttpEvent<T>) =>
      httpEvent instanceof HttpResponse

  readonly isCacheableResponse =
    <T>(response: HttpResponse<T>) =>
      this.isCacheableResponseCode(response.status)

  readonly writeResponseHeaders =
    <T>(response: HttpResponse<T>) => {
      const cacheHeader = response.headers.get(this.headerKey) || ''
      if (cacheHeader) {
        this.factory(this.headerKey)(cacheHeader)(this.tagDelimiter)
      }
    }

  intercept<T>(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<T>> {
    const next$ = next.handle(req).pipe(share())
    const httpResponseEvents$ = next$.pipe(filter<HttpResponse<T>>(this.isHttpResponseEvent))
    const otherHttpEvents$ = next$.pipe(filter<HttpEvent<T>>(e => !this.isHttpResponseEvent(e)))
    const nonCacheable$ = httpResponseEvents$.pipe(filter(res => !this.isCacheableResponse(res)))
    const cacheable$ = httpResponseEvents$.pipe(filter(this.isCacheableResponse), tap(this.writeResponseHeaders))

    return merge(otherHttpEvents$, nonCacheable$, cacheable$)
  }
}
