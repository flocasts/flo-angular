import { Injectable } from '@angular/core'
import { IAdBlockService } from './ad-block.interface'
import { AD_BLOCK_LOADER } from './ad-block.tokens'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
  deps: [AD_BLOCK_LOADER],
  useFactory
})
export class AdBlockService implements IAdBlockService {
  constructor(private _loader: Observable<boolean>) { }

  readonly isAnAdBlockerActive = () => this._loader
}

export function useFactory(loader: Observable<boolean>) {
  return new AdBlockService(loader)
}
