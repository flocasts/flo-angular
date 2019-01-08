import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core'
import { HttpCacheTagInterceptor } from './http-cache-tag.interceptor'
import { CACHE_TAG_CONFIG, CACHE_TAG_WRITE_HEADER_FACTORY, ICacheTagConfig, IWriteResponseHeader } from './http-cache-tag.tokens'
import { HTTP_INTERCEPTORS } from '@angular/common/http'

export const DEFAULT_CACHE_TAG_CONFIGURATION: ICacheTagConfig = {
  cacheableResponseCodes: [200],
  headerKey: 'Cache-Tag'
}

/**
 * noop, since in theory we can allow more servers than just express.
 */
export function DEFAULT_WRITE_HEADER_FACTORY(): IWriteResponseHeader {
  const lambda: IWriteResponseHeader = _response => _headerKey => _responseHeader => { }
  return lambda
}

@NgModule({
  providers: [
    {
      provide: HttpCacheTagInterceptor,
      useClass: HttpCacheTagInterceptor,
      deps: [CACHE_TAG_CONFIG, CACHE_TAG_WRITE_HEADER_FACTORY]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: HttpCacheTagInterceptor,
      multi: true
    },
    {
      provide: CACHE_TAG_WRITE_HEADER_FACTORY,
      useFactory: DEFAULT_WRITE_HEADER_FACTORY
    },
    {
      provide: CACHE_TAG_CONFIG,
      useValue: DEFAULT_CACHE_TAG_CONFIGURATION
    }
  ]
})
export class HttpCacheTagServerModule {
  static withConfig(config: Partial<ICacheTagConfig> = {}): ModuleWithProviders {
    return {
      ngModule: HttpCacheTagServerModule,
      providers: [
        {
          provide: CACHE_TAG_CONFIG,
          useValue: {
            ...DEFAULT_CACHE_TAG_CONFIGURATION,
            ...config
          }
        }
      ]
    }
  }
}
