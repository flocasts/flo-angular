import { NgModule } from '@angular/core'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { ENV_CONFIG, ENV_CONFIG_TS_KEY } from './node-env-transfer.tokens'
import { NodeEnvTransferCommonModule } from './node-env-transfer.common.module'
import { BrowserTransferStateModule } from '@angular/platform-browser'

export function defaultBrowserFactory(ts: TransferState, stateKey: string) {
  return ts.get(makeStateKey(stateKey), {})
}

@NgModule({
  imports: [
    BrowserTransferStateModule,
    NodeEnvTransferCommonModule
  ],
  providers: [
    {
      provide: ENV_CONFIG,
      useFactory: defaultBrowserFactory,
      deps: [TransferState, ENV_CONFIG_TS_KEY]
    }
  ]
})
export class NodeEnvTransferBrowserModule { }
