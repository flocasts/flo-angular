import { Observable } from 'rxjs'

export interface ICookieService {
  readonly cookies$: <T>() => Observable<T>
  readonly getAll: <T>() => T
  readonly get: <T>(name: string) => T
  // set(name: string, value: any, options?: CookieAttributes): void
  // remove(name: string, options?: CookieAttributes): void
}

