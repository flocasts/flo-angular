import { Observable } from 'rxjs'

export interface IAdBlockService {
  readonly isAnAdBlockerActive: () => Observable<boolean>
}

export type IAdBlockLoader = () => Observable<boolean>
