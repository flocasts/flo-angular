import { Injectable, Inject, Optional } from '@angular/core'
import { ISvgLoaderBrowserCacheService } from './svg-transfer-state.interfaces'
import { SVG_LOADER_BROWSER_CACHE_MAX_AGE } from './svg-transfer-state.tokens'

@Injectable()
export class SvgBrowserLoaderCacheService implements ISvgLoaderBrowserCacheService {
  constructor(@Optional() @Inject(SVG_LOADER_BROWSER_CACHE_MAX_AGE) private _maxAge?: number) { }

  readonly get = (svgKey: string) =>
    this._maxAge && this._maxAge > 0
      ? this.localGet(svgKey)
      : this.sessionGet(svgKey)

  readonly set = (svgKey: string, value: string) => {
    this._maxAge && this._maxAge > 0
      ? this.localStore(svgKey, value)
      : this.sessionStore(svgKey, value)
  }

  sessionStore(key: string, value: string) {
    try {
      sessionStorage.setItem(key, value)
    } catch { }
  }

  sessionGet(key: string) {
    try {
      return sessionStorage.getItem(key)
    } catch {
      return undefined
    }
  }

  localStore(key: string, value: string) {
    try {
      localStorage.setItem(key, JSON.stringify({ value, ts: Date.now() }))
    } catch { }
  }

  localGet(key: string) {
    try {
      const obj = JSON.parse(localStorage.getItem(key) || '{}')
      const expired = obj.ts < Date.now() - (this._maxAge || 0)
      return expired ? undefined : obj.value
    } catch {
      return undefined
    }
  }
}
