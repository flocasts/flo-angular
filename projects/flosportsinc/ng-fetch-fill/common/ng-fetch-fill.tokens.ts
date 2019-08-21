import { InjectionToken } from '@angular/core'
import { Observable } from 'rxjs'
import { IResult } from 'typescript-monads'

export type ILoaderFactory<TInItem = any, TOutItem = any, TInError = any, TOutError = any> = ILoader<TInItem, TOutItem, TInError, TOutError>

export interface StringDict<TItem, TError> {
  readonly [key: string]: IResult<TItem, TError>
}

export interface ILoader<TInItem, TOutItem, TInError, TOutError> {
  readonly key: string
  readonly func: (items: ReadonlyArray<TInItem>) => Observable<IResult<StringDict<TOutItem, TInError>, TOutError>>
}

export const LOADERS = new InjectionToken<ReadonlyArray<ILoader<any, any, any, any>>>('fs.ff.loaders')
export const FS_FETCH_FILL_DEBOUNCE = new InjectionToken<ReadonlyArray<ILoader<any, any, any, any>>>('fs.ff.debounce')
