import { InjectionToken } from '@angular/core'
import { Observable } from 'rxjs'

export type ILoaderFactory<TItem = any> = ILoader<TItem>

export interface IFetchFillTemplateResponse {
  readonly success: boolean
}

export interface ILoader<TItem> {
  readonly key: string
  readonly func: (items: ReadonlyArray<TItem>) => Observable<IFetchFillTemplateResponse>
}

export const LOADERS = new InjectionToken<ReadonlyArray<ILoader<any>>>('fs.ff.loaders')
