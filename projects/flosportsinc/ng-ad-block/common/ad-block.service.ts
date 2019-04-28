import { Injectable, Inject } from '@angular/core'
import { IAdBlockService } from './ad-block.interface'
import { AD_BLOCK_LOADER } from './ad-block.tokens'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AdBlockService implements IAdBlockService {
  constructor(@Inject(AD_BLOCK_LOADER) private _loader: Observable<boolean>) { }

  readonly isAnAdBlockerActive = () => this._loader
}

