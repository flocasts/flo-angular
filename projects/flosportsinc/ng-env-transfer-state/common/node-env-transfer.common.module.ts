import { NgModule, ModuleWithProviders } from '@angular/core'
import { ENV_CONFIG_TS_KEY, NODE_ENV_USE_VALUES } from './node-env-transfer.tokens'
import { NodeEnvTransferService } from './node-env-transfer.service'

export const DEFAULT_ENV_CONFIG_TS_KEY = 'NODE_ENV'
export const DEFAULT_NODE_ENV_USE_VALUES = {}

export interface INodeEnvTransferModuleConfig {
  readonly useValues: { readonly [key: string]: any }
}

@NgModule({
  providers: [
    NodeEnvTransferService,
    {
      provide: ENV_CONFIG_TS_KEY,
      useValue: 'NODE_ENV'
    },
    {
      provide: NODE_ENV_USE_VALUES,
      useValue: DEFAULT_NODE_ENV_USE_VALUES
    }
  ]
})
export class NodeEnvTransferModule {
  static config(config: Partial<INodeEnvTransferModuleConfig> = {}): ModuleWithProviders {
    return {
      ngModule: NodeEnvTransferModule,
      providers: [
        {
          provide: NODE_ENV_USE_VALUES,
          useValue: config && config.useValues || DEFAULT_NODE_ENV_USE_VALUES
        }
      ]
    }
  }
}
