import { NgModule, ModuleWithProviders, Injector } from '@angular/core'
import { CACHE_TAG_CONFIG, CACHE_TAG_WRITE_HEADER_FACTORY, ICacheTagConfig, IWriteResponseHeader } from './http-cache-tag.tokens'
import { Response } from 'express'
import { HttpCacheTagServerModule, DEFAULT_CACHE_TAG_CONFIGURATION } from './http-cache-tag.module'
import { RESPONSE } from '@nguniversal/express-engine/tokens'

export const immutableAppend =
  (str: string) =>
    (delimiter = ',') =>
      (value: string) =>
        [...str.split(delimiter), value]
          .filter((el, i, a) => i === a.indexOf(el))
          .filter(Boolean)
          .join(delimiter)

export const appendResponseHeader = (response: Response) => (key: string) => (value: string) => (delimiter = ',') => {
  const current = (response.getHeader(key) || '').toString()
  const newValue = immutableAppend(current)(delimiter)(value)
  response.header(key, newValue)
}

export function DEFAULT_EXPRESS_WRITE_HEADER_FACTORY(inj: Injector): IWriteResponseHeader {
  const lambda: IWriteResponseHeader =
    headerKey =>
      httpClientResponseCacheTag =>
        delimiter =>
          appendResponseHeader(inj.get(RESPONSE))(headerKey)(httpClientResponseCacheTag)(delimiter)
  return lambda
}

@NgModule({
  imports: [HttpCacheTagServerModule],
  providers: [
    {
      provide: CACHE_TAG_WRITE_HEADER_FACTORY,
      useFactory: DEFAULT_EXPRESS_WRITE_HEADER_FACTORY,
      deps: [Injector]
    }
  ]
})
export class HttpCacheTagExpressServerModule {
  static withConfig(config: Partial<ICacheTagConfig> = {}): ModuleWithProviders {
    return {
      ngModule: HttpCacheTagExpressServerModule,
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
