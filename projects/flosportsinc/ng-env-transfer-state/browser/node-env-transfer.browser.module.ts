import { NgModule, ModuleWithProviders } from '@angular/core'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { BrowserTransferStateModule } from '@angular/platform-browser'
import { FloNodeEnvTransferModule, ENV, ENV_CONFIG_TS_KEY, ENV_CONFIG_DEFAULT, NODE_ENV_USE_VALUES } from '@flosportsinc/ng-env-transfer-state'

export function defaultBrowserFactory(ts: TransferState, stateKey: string, merge: Object, sharedMerge: Object) {
  return {
    ...ts.get(makeStateKey(stateKey), {}),
    ...sharedMerge,
    ...merge
  }
}

export interface INodeEnvTransferBrowserModuleConfigDict {
  readonly [key: string]: string | boolean | undefined
}

export interface INodeEnvTransferBrowserModuleConfig {
  readonly mergeWithServer?: INodeEnvTransferBrowserModuleConfigDict
}

export const NODE_ENV_CONFIG_DEFAULT = {}

@NgModule({
  imports: [
    BrowserTransferStateModule,
    FloNodeEnvTransferModule
  ],
  providers: [
    {
      provide: ENV_CONFIG_DEFAULT,
      useValue: NODE_ENV_CONFIG_DEFAULT
    },
    {
      provide: ENV,
      useFactory: defaultBrowserFactory,
      deps: [TransferState, ENV_CONFIG_TS_KEY, ENV_CONFIG_DEFAULT, NODE_ENV_USE_VALUES]
    }
  ]
})
export class FloNodeEnvTransferBrowserModule {
  static config(config: INodeEnvTransferBrowserModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: FloNodeEnvTransferBrowserModule,
      providers: [
        {
          provide: ENV_CONFIG_DEFAULT,
          useValue: config.mergeWithServer || NODE_ENV_CONFIG_DEFAULT
        }
      ]
    }
  }
}
