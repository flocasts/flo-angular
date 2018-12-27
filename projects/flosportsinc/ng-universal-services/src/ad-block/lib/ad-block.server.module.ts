import { NgModule } from '@angular/core'
import { AdBlockService } from './ad-block.service'
import { of } from 'rxjs'
import { IAdBlockService } from './ad-block.interface'

class AdBlockServerService implements IAdBlockService {
  readonly isAnAdBlockerActive = () => of(false)
}

@NgModule({
  providers: [{
    provide: AdBlockService,
    useClass: AdBlockServerService
  }]
})
export class AdBlockServerModule { }
