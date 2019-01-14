import { NgModule } from '@angular/core'
import { ENV_CONFIG_TS_KEY } from './node-env-transfer.tokens'
import { NodeEnvTransferService } from './node-env-transfer.service'

@NgModule({
  providers: [
    NodeEnvTransferService,
    {
      provide: ENV_CONFIG_TS_KEY,
      useValue: 'NODE_ENV'
    }
  ]
})
export class NodeEnvTransferCommonModule { }
