declare var fs: any

import {
  SVG_TRANSFER_KEY, SVG_LOADER_HTTP_REQUEST, SVG_LOADER_ERROR_RETURN_OPERATOR, SVG_SERVER_CACHE, SVG_REQUEST_PATTERN,
  ISvgRequestPatternFunc, ISvgLoaderService, ISvgLoaderHttpFunc, ISvgLoaderErrorReturnValueStreamFunc,
  ISvgServerCache
} from '@flosportsinc/ng-svg-transfer-state'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { Injectable, Inject, Optional } from '@angular/core'
import { bindNodeCallback, of } from 'rxjs'
import { tap, map, catchError } from 'rxjs/operators'
import { readFile } from 'fs'

@Injectable()
export class SvgServerLoaderService implements ISvgLoaderService {
  constructor(private _ts: TransferState,
    @Inject(SVG_REQUEST_PATTERN) private _reqPattern: ISvgRequestPatternFunc,
    @Inject(SVG_LOADER_HTTP_REQUEST) private _httpRequest: ISvgLoaderHttpFunc,
    @Inject(SVG_LOADER_ERROR_RETURN_OPERATOR) private _errorHandler: ISvgLoaderErrorReturnValueStreamFunc,
    @Optional() @Inject(SVG_SERVER_CACHE) private _cache?: ISvgServerCache) { }

  readonly load = (svgKey: string) => {
    const cachedValue = this._cache && this._cache.get(svgKey)
    const svg_ = cachedValue
      ? of(cachedValue)
      : svgKey.includes('://')
        ? this._httpRequest(svgKey)
        : bindNodeCallback(readFile)(this._reqPattern(svgKey))
          .pipe(
            map(a => a.toString()),
            catchError(err => this._errorHandler(err)))

    return svg_.pipe(
      tap(this.cacheForNodeServer(svgKey)),
      tap(this.cacheForBrowserReflow(svgKey))
    )
  }

  readonly cacheForBrowserReflow = (svgKey: string) => (svg: string) => {
    const stateKey = makeStateKey(SVG_TRANSFER_KEY.toString())
    const current = this._ts.get(stateKey, {})
    this._ts.set(stateKey, { ...current, [svgKey]: svg })
  }

  readonly cacheForNodeServer = (svgKey: string) => (svg: string) => {
    this._cache && this._cache.set(svgKey, svg)
  }
}
