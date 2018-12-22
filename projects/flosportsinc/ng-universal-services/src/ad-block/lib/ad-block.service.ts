import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { IAdBlockService } from './ad-block.interface'
import { isPlatformBrowser } from '@angular/common'
import { catchError, map } from 'rxjs/operators'
import { AD_BLOCK_PING_URL } from './ad-block.tokens'
import { of } from 'rxjs'

const returnFalse = () => false
const returnTrusObs = () => of(true)

@Injectable({
  providedIn: 'root'
})
export class AdBlockService implements IAdBlockService {
  constructor(private _http: HttpClient,
    @Inject(PLATFORM_ID) private _platformId: string,
    @Inject(AD_BLOCK_PING_URL) private _pingUrl: string) { }

  readonly isAnAdBlockerActive = () =>
    isPlatformBrowser(this._platformId)
      ? this._http
        .get(this._pingUrl)
        .pipe(map(returnFalse), catchError(returnTrusObs))
      : of(false)
}
