import { InjectionToken } from '@angular/core'

export interface ICacheTagConfig {
  readonly headerKey: string
  readonly cacheableResponseCodes: ReadonlyArray<number>
  readonly delimiter: string
}

export type IWriteResponseHeader =
  (serverResponseHeaderKey: string) =>
    (httpClientResponseCacheTag: string) =>
      (delimiter?: string) => void

export const CACHE_TAG_CONFIG = new InjectionToken<ICacheTagConfig>(
  'fs.hct.cfg'
)
export const CACHE_TAG_WRITE_HEADER_FACTORY = new InjectionToken<IWriteResponseHeader>(
  'fs.hct.wheader'
)
