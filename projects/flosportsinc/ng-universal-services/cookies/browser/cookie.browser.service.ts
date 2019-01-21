import { ICookieService, StringDict, KeyValue } from './cookie.interfaces'
import { CookieAttributes, getJSON, remove, set } from 'js-cookie'
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

@Injectable()
export class CookieBrowserService implements ICookieService {
  private readonly _cookieSource = new Subject<StringDict>()
  private readonly _changeSource = new Subject<KeyValue>()

  public readonly valueChange = this._changeSource.asObservable()
  public readonly valueChanges = this._cookieSource.asObservable()

  targetValueChange(key: string) {
    return this.valueChange.pipe(filter(a => a && a.key === key))
  }

  public set(name: string, value: any, opts?: CookieAttributes): void {
    set(name, value, opts)
    this.updateSource()
    this.broadcastChange(name)
  }

  public remove(name: string, opts?: CookieAttributes): void {
    remove(name, opts)
    this.updateSource()
    this.broadcastChange(name)
  }

  public readonly get = <T>(name: string) => getJSON(name) as T

  public readonly getAll = () => getJSON()

  private readonly updateSource = () => this._cookieSource.next(this.getAll())

  private broadcastChange(key: string) {
    this._changeSource.next({
      key,
      value: this.get(key)
    })
  }
}
