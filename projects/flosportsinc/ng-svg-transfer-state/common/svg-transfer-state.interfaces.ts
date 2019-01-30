import { Observable } from 'rxjs'

export type ISvgLoaderReturnValue = string | undefined

export type ISvgRequestPatternFunc = (svgKey: string) => string
export type ISvgLoaderHttpFunc = (svgKey: string) => Observable<ISvgLoaderReturnValue>
export type ISvgLoaderErrorReturnValueStreamFunc = (err: any) => Observable<ISvgLoaderReturnValue>

export interface ISvgLoaderService {
  readonly load: (svgKey: string) => Observable<ISvgLoaderReturnValue>
}

export interface ISvgLoaderBrowserCacheService {
  readonly get: (svgKey: string) => string | undefined
  readonly set: (svgKey: string, value: string) => void
}

export interface StringDict {
  readonly [key: string]: string
}

export interface ISvgServerCache {
  readonly set: (key: string, value: string) => void
  readonly get: (key: string) => string
}
