import { of } from 'rxjs'
import { Injectable, Inject } from '@angular/core'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { SVG_TRANSFER_KEY, SVG_LOADER_HTTP_REQUEST } from './svg-transfer-state.tokens'
import { ISvgLoaderService, StringDict, ISvgLoaderHttpFunc } from './svg-transfer-state.interfaces'

@Injectable()
export class SvgBrowserLoaderService implements ISvgLoaderService {
  constructor(private _ts: TransferState, @Inject(SVG_LOADER_HTTP_REQUEST) private _httpRequest: ISvgLoaderHttpFunc) { }

  private readonly _getFromTransferCache =
    (svgKey: string): string | undefined =>
      this._ts.get<StringDict>(makeStateKey(SVG_TRANSFER_KEY), {})[svgKey]

  readonly load = (svgKey: string) => {
    const fromServerTransferCache = this._getFromTransferCache(svgKey)

    return fromServerTransferCache
      ? of(fromServerTransferCache)
      : this._httpRequest(svgKey)
  }
}
