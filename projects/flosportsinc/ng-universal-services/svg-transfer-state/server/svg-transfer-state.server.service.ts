import { Injectable, Inject } from '@angular/core'
import { bindNodeCallback } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { tap, map, catchError } from 'rxjs/operators'
import { readFile } from 'fs'
import { SVG_TRANSFER_KEY, SVG_LOADER_ERROR_RETURN_OPERATOR } from './svg-transfer-state.tokens'
import { ISvgLoaderService, ISvgLoaderErrorReturnValueStreamFunc } from './svg-transfer-state.interfaces'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { SVG_REQUEST_PATTERN } from './svg-transfer-state.tokens'
import { ISvgRequestPatternFunc } from './svg-transfer-state.interfaces'

@Injectable()
export class SvgServerLoaderService implements ISvgLoaderService {
  constructor(private _ts: TransferState, private _http: HttpClient,
    @Inject(SVG_REQUEST_PATTERN) private _reqPattern: ISvgRequestPatternFunc,
    @Inject(SVG_LOADER_ERROR_RETURN_OPERATOR) private _catchHandler: ISvgLoaderErrorReturnValueStreamFunc) { }

  readonly load = (svgKey: string) =>
    svgKey.includes('http://') || svgKey.includes('https://')
      ? this._http.get(svgKey, { responseType: 'text', withCredentials: false }).pipe(
        catchError(err => this._catchHandler(err)))
      : bindNodeCallback(readFile)(this._reqPattern(svgKey))
        .pipe(
          map(a => a.toString()),
          tap(this.cacheForBrowserReflow(svgKey)))

  readonly cacheForBrowserReflow = (svgKey: string) => (svg: string) => {
    const stateKey = makeStateKey(SVG_TRANSFER_KEY)
    const current = this._ts.get(stateKey, {})
    this._ts.set(stateKey, { ...current, [svgKey]: svg })
  }
}
