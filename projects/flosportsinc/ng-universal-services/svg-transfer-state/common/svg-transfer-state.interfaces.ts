import { Observable } from 'rxjs'

export type ISvgLoaderReturnValue = string | undefined

export type ISvgRequestPatternFunc = (svgKey: string) => string

export type ISvgLoaderErrorReturnValueStreamFunc = (err: any) => Observable<ISvgLoaderReturnValue>

export interface ISvgLoaderService {
  readonly load: (svgKey: string) => Observable<ISvgLoaderReturnValue>
}

export interface StringDict {
  readonly [key: string]: string
}
