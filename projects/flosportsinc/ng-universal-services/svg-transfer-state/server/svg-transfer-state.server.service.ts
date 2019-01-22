import { Injectable } from '@angular/core'
import { bindNodeCallback } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { tap, map } from 'rxjs/operators'
import { readFile } from 'fs'
import { SVG_TRANSFER_KEY } from './svg-transfer-state.tokens'
import { ISvgLoaderService } from './svg-transfer-state.interfaces'
import { TransferState, makeStateKey } from '@angular/platform-browser'

@Injectable()
export class SvgServerLoaderService implements ISvgLoaderService {
  constructor(private _ts: TransferState, private _http: HttpClient) { }

  readonly load = (svgKey: string) =>
    svgKey.includes('http://') || svgKey.includes('https://')
      ? this._http.get(svgKey, { responseType: 'text' })
      : bindNodeCallback(readFile)(`./dist/assets/svg/${svgKey}.svg`)
        .pipe(
          map(a => a.toString()),
          tap(this.cacheForBrowserReflow(svgKey)))

  readonly cacheForBrowserReflow = (svgKey: string) => (svg: string) => {
    const stateKey = makeStateKey(SVG_TRANSFER_KEY)
    const current = this._ts.get(stateKey, {})
    this._ts.set(stateKey, { ...current, [svgKey]: svg })
  }
}
