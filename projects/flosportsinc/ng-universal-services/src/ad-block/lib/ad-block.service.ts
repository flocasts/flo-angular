import { Injectable, Inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { IAdBlockService } from './ad-block.interface'
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
    @Inject(AD_BLOCK_PING_URL) private _pingUrl: string) { }

  readonly isAnAdBlockerActive = () => this._http
    .get(this._pingUrl)
    .pipe(map(returnFalse), catchError(returnTrusObs))
}
