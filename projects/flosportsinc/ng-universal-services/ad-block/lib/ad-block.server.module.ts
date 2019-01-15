import { NgModule } from '@angular/core'
import { AdBlockService } from './ad-block.service'
import { AdBlockServerService } from './ad-block.server.service'

@NgModule({
  providers: [{
    provide: AdBlockService,
    useClass: AdBlockServerService
  }]
})
export class AdBlockServerModule { }
