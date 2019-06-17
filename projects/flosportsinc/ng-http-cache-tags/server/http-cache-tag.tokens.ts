import { InjectionToken } from '@angular/core'

export type IWriteResponseHeader =
  (serverResponseHeaderKey: string) =>
    (httpClientResponseCacheTag: string) =>
      (delimiter?: string) => void

export const CACHE_TAG_RESPONSE_CODES = new InjectionToken<ReadonlyArray<number>>('fs.hct.rc')
export const CACHE_TAG_HEADER_KEY = new InjectionToken<string>('fs.hct.hk')
export const CACHE_TAG_DELIMITER = new InjectionToken<string>('fs.hct.td')
export const CACHE_TAG_WRITE_HEADER_FACTORY = new InjectionToken<IWriteResponseHeader>('fs.hct.whead')

export const DEFAULT_CACHE_TAG_RESPONSE_CODES: ReadonlyArray<any> = [200]
export const DEFAULT_CACHE_TAG_HEADER_KEY = 'Cache-Tag'
export const DEFAULT_CACHE_TAG_DELIMITER = ','
