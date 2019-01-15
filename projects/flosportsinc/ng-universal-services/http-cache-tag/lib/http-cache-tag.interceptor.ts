import { Inject, Injectable } from '@angular/core'
import { filter, tap, mergeAll, share } from 'rxjs/operators'
import { Observable, merge, race } from 'rxjs'
import { CACHE_TAG_CONFIG, ICacheTagConfig, CACHE_TAG_WRITE_HEADER_FACTORY, IWriteResponseHeader } from './http-cache-tag.tokens'
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpEvent
} from '@angular/common/http'

// tslint:disable:no-if-statement
@Injectable()
export class HttpCacheTagInterceptor implements HttpInterceptor {
  constructor(
    @Inject(CACHE_TAG_CONFIG) private config: ICacheTagConfig,
    @Inject(CACHE_TAG_WRITE_HEADER_FACTORY) private factory: IWriteResponseHeader
  ) { }

  readonly isCacheableResponseCode = (code: number) => (this.config.cacheableResponseCodes || []).find(a => a === code) ? true : false

  readonly isHttpResponseEvent =
    <T>(httpEvent: HttpEvent<T>) =>
      httpEvent instanceof HttpResponse

  readonly isCacheableResponse =
    <T>(response: HttpResponse<T>) =>
      this.isCacheableResponseCode(response.status)

  readonly writeResponseHeaders =
    <T>(response: HttpResponse<T>) => {
      const cacheHeader = response.headers.get(this.config.headerKey) || ''
      if (cacheHeader) {
        this.factory(this.config.headerKey)(cacheHeader)(this.config.delimiter)
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
