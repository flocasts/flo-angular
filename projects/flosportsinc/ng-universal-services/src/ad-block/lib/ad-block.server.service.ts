import { Injectable } from '@angular/core'
import { IAdBlockService } from './ad-block.interface'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AdBlockServerService implements IAdBlockService {
  readonly isAnAdBlockerActive = () => of(false)
}
