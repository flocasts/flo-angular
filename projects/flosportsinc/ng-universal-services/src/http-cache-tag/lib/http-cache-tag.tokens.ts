import { InjectionToken } from '@angular/core'

export interface ICacheTagConfig {
  readonly headerKey: string
  readonly cacheableResponseCodes: ReadonlyArray<number>
}

export type IWriteResponseHeader<T> =
  (serverResponse: T) =>
    (serverResponseHeaderKey: string) =>
      (httpClientResponseCacheTag: string) => void

export const CACHE_TAG_CONFIG = new InjectionToken<ICacheTagConfig>(
  'flo.http-cache.config'
)
export const CACHE_TAG_WRITE_HEADER_FACTORY = new InjectionToken<IWriteResponseHeader<any>>(
  'flo.http-cache.write-header'
)
