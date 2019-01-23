import { Injectable, Inject } from '@angular/core'
import { bindNodeCallback } from 'rxjs'
import { tap, map } from 'rxjs/operators'
import { readFile } from 'fs'
import { SVG_TRANSFER_KEY, SVG_LOADER_HTTP_REQUEST } from './svg-transfer-state.tokens'
import { ISvgLoaderService, ISvgLoaderHttpFunc } from './svg-transfer-state.interfaces'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { SVG_REQUEST_PATTERN } from './svg-transfer-state.tokens'
import { ISvgRequestPatternFunc } from './svg-transfer-state.interfaces'

@Injectable()
export class SvgServerLoaderService implements ISvgLoaderService {
  constructor(private _ts: TransferState,
    @Inject(SVG_REQUEST_PATTERN) private _reqPattern: ISvgRequestPatternFunc,
    @Inject(SVG_LOADER_HTTP_REQUEST) private _httpRequest: ISvgLoaderHttpFunc) { }

  readonly load = (svgKey: string) =>
    svgKey.includes('://')
      ? this._httpRequest(svgKey)
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
