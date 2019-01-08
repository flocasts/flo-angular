import { Inject, Injectable } from '@angular/core'
import { filter, tap } from 'rxjs/operators'
import { Observable, merge } from 'rxjs'
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
    @Inject(CACHE_TAG_WRITE_HEADER_FACTORY) private factory: IWriteResponseHeader<any>
  ) {
    if (!config.headerKey) { throw new Error('missing config.headerKey') }
    if (!config.cacheableResponseCodes) { throw new Error('missing config.cacheableResponseCodes') }
  }

  readonly isCacheableResponseCode = (code: number) => this.config.cacheableResponseCodes.find(a => a === code) ? true : false

  readonly isHttpResponseEvent =
    <T>(httpEvent: HttpEvent<T>) =>
      httpEvent instanceof HttpResponse

  readonly isCacheableResponse =
    <T>(response: HttpResponse<T>) =>
      this.isCacheableResponseCode(response.status)

  readonly writeResponseHeaders =
    <T>(response: HttpResponse<T>) => {
      return this.factory(response)('')('')
    }

  intercept<T>(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<T>> {
    const httpResponseEvents$ = next.handle(req).pipe(filter<HttpResponse<T>>(this.isHttpResponseEvent))
    const otherHttpEvents$ = next.handle(req).pipe(filter<HttpEvent<T>>(e => !this.isHttpResponseEvent(e)))
    const nonCacheable$ = httpResponseEvents$.pipe(filter(res => !this.isCacheableResponse(res)))
    const cacheable$ = httpResponseEvents$.pipe(filter(this.isCacheableResponse), tap(this.writeResponseHeaders))

    return merge(otherHttpEvents$, nonCacheable$, cacheable$)
  }
}
