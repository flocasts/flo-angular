import { ICookieService, StringDict, KeyValue } from '@flosportsinc/ng-universal-services/cookies'
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

  public readonly targetValueChange = (key: string) => this.valueChange.pipe(filter(a => a && a.key === key))

  public readonly set = <T>(name: string, value: T, opts?: CookieAttributes) => {
    set(name, value as any, opts)
    this.updateSource()
    this.broadcastChange(name)
  }

  public readonly remove = (name: string, opts?: CookieAttributes) => {
    remove(name, opts)
    this.updateSource()
    this.broadcastChange(name)
  }

  public readonly get = <T>(name: string) => getJSON(name) as T
  public readonly getAll = <T>() => getJSON() as Partial<T>
  private readonly updateSource = () => this._cookieSource.next(this.getAll())

  private broadcastChange(key: string) {
    this._changeSource.next({
      key,
      value: this.get(key)
    })
  }
}
