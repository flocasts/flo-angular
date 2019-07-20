import { NgModule, ModuleWithProviders, Injector } from '@angular/core'
import {
  CACHE_TAG_WRITE_HEADER_FACTORY, IWriteResponseHeader,
  CACHE_TAG_RESPONSE_CODES, DEFAULT_CACHE_TAG_RESPONSE_CODES,
  CACHE_TAG_HEADER_KEY, DEFAULT_CACHE_TAG_HEADER_KEY,
  CACHE_TAG_DELIMITER, DEFAULT_CACHE_TAG_DELIMITER
} from './http-cache-tag.tokens'
import { Response } from 'express'
import { RESPONSE } from '@nguniversal/express-engine/tokens'
import { FloHttpCacheTagServerModule, IHttpCacheTagServerModuleConfig } from './http-cache-tag.module'

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
  imports: [FloHttpCacheTagServerModule],
  providers: [
    {
      provide: CACHE_TAG_WRITE_HEADER_FACTORY,
      useFactory: DEFAULT_EXPRESS_WRITE_HEADER_FACTORY,
      deps: [Injector]
    }
  ]
})
export class FloHttpCacheTagExpressServerModule {
  static config(config: Partial<IHttpCacheTagServerModuleConfig>): ModuleWithProviders {
    return {
      ngModule: FloHttpCacheTagExpressServerModule,
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
