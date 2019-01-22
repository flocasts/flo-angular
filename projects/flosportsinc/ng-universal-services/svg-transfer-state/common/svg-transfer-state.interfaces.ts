import { Observable } from 'rxjs'

export type ISvgRequestPatternFunc = (svgKey: string) => string

export interface ISvgLoaderService {
  readonly load: (svgKey: string) => Observable<string>
}