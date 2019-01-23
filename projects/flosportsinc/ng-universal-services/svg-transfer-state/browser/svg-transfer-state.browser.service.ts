import { of } from 'rxjs'
import { Injectable, Inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { SVG_TRANSFER_KEY, SVG_REQUEST_PATTERN, SVG_LOADER_ERROR_RETURN_OPERATOR } from './svg-transfer-state.tokens'
import {
  ISvgLoaderService, StringDict, ISvgRequestPatternFunc,
  ISvgLoaderErrorReturnValueStreamFunc
} from './svg-transfer-state.interfaces'
import { catchError } from 'rxjs/operators'

@Injectable()
export class SvgBrowserLoaderService implements ISvgLoaderService {
  constructor(private _ts: TransferState, private _http: HttpClient,
    @Inject(SVG_REQUEST_PATTERN) private _reqPattern: ISvgRequestPatternFunc,
    @Inject(SVG_LOADER_ERROR_RETURN_OPERATOR) private _catchHandler: ISvgLoaderErrorReturnValueStreamFunc) { }

  private readonly _getFromTransferCache =
    (svgKey: string): string | undefined =>
      this._ts.get<StringDict>(makeStateKey(SVG_TRANSFER_KEY), {})[svgKey]

  readonly load = (svgKey: string) => {
    const fromServerTransferCache = this._getFromTransferCache(svgKey)

    return fromServerTransferCache
      ? of(fromServerTransferCache)
      : this._http.get(this._reqPattern(svgKey), { responseType: 'text', withCredentials: false }).pipe(
        catchError(err => this._catchHandler(err))
      )
  }
}
