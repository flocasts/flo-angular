import { Injectable, InjectionToken, Inject } from '@angular/core'

export const WINDOW = new InjectionToken<Window>('cfg.window')

export interface IWindowService {
  window<T>(): Window & T
}

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  constructor(@Inject(WINDOW) private _window: Window) { }

  public readonly window = <T>() => this._window as Window & T
}
