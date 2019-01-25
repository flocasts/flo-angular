import { Injectable, Inject, Optional } from '@angular/core'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { SVG_TRANSFER_KEY, SVG_LOADER_HTTP_REQUEST, SVG_LOADER_BROWSER_CACHE } from './svg-transfer-state.tokens'
import { ISvgLoaderService, StringDict, ISvgLoaderHttpFunc, ISvgLoaderBrowserCacheService } from './svg-transfer-state.interfaces'
import { of } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class SvgBrowserLoaderService implements ISvgLoaderService {
  constructor(private _ts: TransferState, @Inject(SVG_LOADER_HTTP_REQUEST) private _httpRequest: ISvgLoaderHttpFunc,
    @Optional() @Inject(SVG_LOADER_BROWSER_CACHE) private _cache?: ISvgLoaderBrowserCacheService) { }

  private readonly _getFromTransferCache =
    (svgKey: string): string | undefined =>
      this._ts.get<StringDict>(makeStateKey(SVG_TRANSFER_KEY), {})[svgKey]

  readonly load = (svgKey: string) => {
    const fromServerTransferCache = this._getFromTransferCache(svgKey)
    const lookupKey = this.cacheKey(svgKey)
    const browserCache = this._cache && this._cache.get(lookupKey)

    return fromServerTransferCache
      ? of(fromServerTransferCache)
      : browserCache
        ? of(browserCache)
        : this._httpRequest(svgKey).pipe(
          tap(v => v && this._cache && this._cache.set(lookupKey, v)))
  }

  readonly cacheKey = (svgKey: string) => `${SVG_TRANSFER_KEY}-${svgKey}`
}
