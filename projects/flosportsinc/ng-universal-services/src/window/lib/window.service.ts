import { Injectable, Inject } from '@angular/core'
import { WINDOW } from './window.tokens'

export interface IWindowService {
  window<T>(): Window & T
}

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  constructor(@Inject(WINDOW) private _window: any) { }

  public readonly window = <T>() => this._window as Window & T
}
