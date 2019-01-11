import { NgModule } from '@angular/core'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { ENV_CONFIG } from './node-env-transfer.tokens'
import { NodeEnvTransferService } from './node-env-transfer.service'

export function defaultFactory(ts: TransferState) {
  return ts.get(makeStateKey('123'), {})
}

@NgModule({
  providers: [
    NodeEnvTransferService,
    {
      provide: ENV_CONFIG,
      useFactory: defaultFactory,
      deps: [TransferState]
    }
  ]
})
export class NodeEnvTransferBrowserModule {}
