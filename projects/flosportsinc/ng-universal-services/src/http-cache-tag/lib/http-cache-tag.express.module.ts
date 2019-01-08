import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core'
import { CACHE_TAG_CONFIG, CACHE_TAG_WRITE_HEADER_FACTORY, ICacheTagConfig, IWriteResponseHeader } from './http-cache-tag.tokens'
import { Response } from 'express'
import { HttpCacheTagServerModule, DEFAULT_CACHE_TAG_CONFIGURATION } from './http-cache-tag.module'
import { RESPONSE } from '@nguniversal/express-engine/tokens'

const appendResponseHeader = (response: Response) => (key: string) => (value: string) => (delimiter = ',') => {
  const current = (response.getHeader(key) || '').toString()

  const newValue = [...current.split(delimiter), value]
    .filter((el, i, a) => i === a.indexOf(el))
    .join(delimiter)

  response.header(key, newValue)
}

export function DEFAULT_EXPRESS_WRITE_HEADER_FACTORY(response: Response): IWriteResponseHeader {
  const lambda: IWriteResponseHeader =
    headerKey =>
      httpClientResponseCacheTag =>
        appendResponseHeader(response)(headerKey)(httpClientResponseCacheTag)()
  return lambda
}

@NgModule({
  imports: [HttpCacheTagServerModule]
})
export class HttpCacheTagExpressServerModule {
  static withConfig(config: Partial<ICacheTagConfig> = {}): ModuleWithProviders {
    return {
      ngModule: HttpCacheTagExpressServerModule,
      providers: [
        {
          provide: CACHE_TAG_WRITE_HEADER_FACTORY,
          useFactory: DEFAULT_EXPRESS_WRITE_HEADER_FACTORY,
          deps: [RESPONSE]
        },
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

  constructor(@Optional() @SkipSelf() parentModule: HttpCacheTagExpressServerModule) {
    // tslint:disable-next-line:no-if-statement
    if (parentModule) {
      throw new Error('HttpCacheTagExpressServerModule already loaded. Import in root module only.')
    }
  }
}
