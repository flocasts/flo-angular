import { of } from 'rxjs'
import { Injectable, Inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { ISvgLoaderService, StringDict } from './svg-transfer-state.interfaces'
import { SVG_TRANSFER_KEY } from './svg-transfer-state.tokens'
// import { SVG_SERVER_REQUEST_PATTERN } from './svg-transfer-state.server.tokens'
// import { SvgServerDirectorPattern } from './svg-transfer-state.server.interfaces'

@Injectable()
export class SvgBrowserLoaderService implements ISvgLoaderService {
  constructor(private _ts: TransferState, private _http: HttpClient) { }

  private readonly _getFromTransferCache =
    (svgKey: string): string | undefined =>
      this._ts.get<StringDict>(makeStateKey(SVG_TRANSFER_KEY), {})[svgKey]

  readonly load = (svgKey: string) => {
    const fromServerTransferCache = this._getFromTransferCache(svgKey)

    return fromServerTransferCache
      ? of(fromServerTransferCache)
      : of(svgKey)
  }
}
