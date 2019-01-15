import { Observable } from 'rxjs'

export interface IAdBlockService {
  readonly isAnAdBlockerActive: () => Observable<boolean>
}

