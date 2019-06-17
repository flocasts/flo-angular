import { NgModule, ModuleWithProviders } from '@angular/core'
import { HttpCacheTagInterceptor } from './http-cache-tag.interceptor'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import {
  CACHE_TAG_WRITE_HEADER_FACTORY, IWriteResponseHeader,
  CACHE_TAG_RESPONSE_CODES, DEFAULT_CACHE_TAG_RESPONSE_CODES,
  CACHE_TAG_HEADER_KEY, DEFAULT_CACHE_TAG_HEADER_KEY, CACHE_TAG_DELIMITER,
  DEFAULT_CACHE_TAG_DELIMITER
} from './http-cache-tag.tokens'

export interface IHttpCacheTagServerModuleConfig {
  readonly headerKey: string
  readonly cacheableResponseCodes: ReadonlyArray<number>
  readonly delimiter: string
}

/**
 * noop, since in theory we can allow more servers than just express.
 */
export function DEFAULT_WRITE_HEADER_FACTORY(): IWriteResponseHeader {
  const lambda: IWriteResponseHeader = _response => _headerKey => _delimiter => { }
  return lambda
}

@NgModule({
  providers: [
    { provide: CACHE_TAG_WRITE_HEADER_FACTORY, useFactory: DEFAULT_WRITE_HEADER_FACTORY },
    { provide: CACHE_TAG_RESPONSE_CODES, useValue: DEFAULT_CACHE_TAG_RESPONSE_CODES },
    { provide: CACHE_TAG_HEADER_KEY, useValue: DEFAULT_CACHE_TAG_HEADER_KEY },
    { provide: CACHE_TAG_DELIMITER, useValue: DEFAULT_CACHE_TAG_DELIMITER },
    {
      provide: HttpCacheTagInterceptor,
      useClass: HttpCacheTagInterceptor,
      deps: [CACHE_TAG_RESPONSE_CODES, CACHE_TAG_HEADER_KEY, CACHE_TAG_DELIMITER, CACHE_TAG_WRITE_HEADER_FACTORY]
    },
    { provide: HTTP_INTERCEPTORS, useExisting: HttpCacheTagInterceptor, multi: true }
  ]
})
export class HttpCacheTagServerModule {
  static config(config: Partial<IHttpCacheTagServerModuleConfig>): ModuleWithProviders {
    return {
      ngModule: HttpCacheTagServerModule,
      providers: [
        {
          provide: CACHE_TAG_RESPONSE_CODES,
          useValue: config.cacheableResponseCodes || DEFAULT_CACHE_TAG_RESPONSE_CODES
        },
        {
          provide: CACHE_TAG_HEADER_KEY,
          useValue: config.headerKey || DEFAULT_CACHE_TAG_HEADER_KEY
        },
        {
          provide: CACHE_TAG_DELIMITER,
          useValue: config.delimiter || DEFAULT_CACHE_TAG_DELIMITER
        }
      ]
    }
  }
}
