import { of } from 'rxjs'
import { Injectable, Inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { ISvgLoaderService } from './svg-transfer-state.interfaces'
// import { SVG_SERVER_REQUEST_PATTERN } from './svg-transfer-state.server.tokens'
// import { SvgServerDirectorPattern } from './svg-transfer-state.server.interfaces'

@Injectable()
export class SvgBrowserLoaderService implements ISvgLoaderService {
  constructor(private _ts: TransferState, private _http: HttpClient) { }

  readonly load = (svgKey: string) => {
    console.log('LOADING')
    return of(svgKey)
  }
}
