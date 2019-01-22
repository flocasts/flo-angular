import { Observable } from 'rxjs'
import { CookieAttributes } from 'js-cookie'

export interface StringDict {
  readonly [key: string]: any
}

export interface KeyValue {
  readonly key: string
  readonly value: any
}

export interface ICookieService {
  readonly valueChange: Observable<KeyValue>
  readonly valueChanges: Observable<StringDict>
  readonly targetValueChange: (key: string) => Observable<KeyValue>
  readonly getAll: <T>() => Partial<T>
  readonly get: <T>(name: string) => T | undefined
  readonly set: <T>(name: string, value: T, options?: CookieAttributes) => void
  readonly remove: (name: string, options?: CookieAttributes) => void
}
