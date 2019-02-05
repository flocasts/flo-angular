import { NgModule, ModuleWithProviders } from '@angular/core'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { NodeEnvTransferModule } from './node-env-transfer.common.module'
import { BrowserTransferStateModule } from '@angular/platform-browser'
import { ENV, ENV_CONFIG_TS_KEY, ENV_CONFIG_DEFAULT } from './node-env-transfer.tokens'

export function defaultBrowserFactory(ts: TransferState, stateKey: string, merge = {}) {
  return {
    ...ts.get(makeStateKey(stateKey), {}),
    ...merge
  }
}

export interface INodeEnvTransferBrowserModuleConfigDict {
  readonly [key: string]: string | boolean | undefined
}

export interface INodeEnvTransferBrowserModuleConfig {
  readonly mergeWithServer?: INodeEnvTransferBrowserModuleConfigDict
}

@NgModule({
  imports: [
    BrowserTransferStateModule,
    NodeEnvTransferModule
  ],
  providers: [
    {
      provide: ENV_CONFIG_DEFAULT,
      useValue: {}
    },
    {
      provide: ENV,
      useFactory: defaultBrowserFactory,
      deps: [TransferState, ENV_CONFIG_TS_KEY, ENV_CONFIG_DEFAULT]
    }
  ]
})
export class NodeEnvTransferBrowserModule {
  static config(config: INodeEnvTransferBrowserModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: NodeEnvTransferBrowserModule,
      providers: [
        {
          provide: ENV_CONFIG_DEFAULT,
          useValue: config.mergeWithServer || {}
        }
      ]
    }
  }
}
