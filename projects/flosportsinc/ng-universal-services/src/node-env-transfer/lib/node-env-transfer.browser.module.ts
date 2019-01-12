import { NgModule } from '@angular/core'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { ENV_CONFIG, ENV_CONFIG_TS_KEY } from './node-env-transfer.tokens'
import { NodeEnvTransferCommonModule } from './node-env-transfer.common.module'

export function defaultFactory(ts: TransferState, stateKey: string) {
  return ts.get(makeStateKey(stateKey), {})
}

@NgModule({
  imports: [NodeEnvTransferCommonModule],
  providers: [
    {
      provide: ENV_CONFIG,
      useFactory: defaultFactory,
      deps: [TransferState, ENV_CONFIG_TS_KEY]
    }
  ]
})
export class NodeEnvTransferBrowserModule {}
