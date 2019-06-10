import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core'
import { ServerTransferStateModule } from '@angular/platform-server'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import {
  NODE_ENV, ENV, ENV_CONFIG_TS_KEY, ENV_CONFIG_SERVER_EXTRACTOR,
  ENV_CONFIG_SERVER_REPLACER, ENV_CONFIG_SERVER_SELECTED, NODE_ENV_USE_VALUES,
  NodeEnvTransferModule
} from '@flosportsinc/ng-env-transfer-state'

export const DEFAULT_ENV_CONFIG_FILTER_KEYS: ReadonlyArray<string> = []
export const DEFAULT_ENV_CONFIG_EXTRACTOR = 'NG_'

export function serverEnvConfigFactory(nodeEnv = {},
  defaultValues: { readonly [key: string]: any },
  selectKeys: ReadonlyArray<string>,
  extractor: string, replacer: (key: string) => string) {
  const keys = Object.keys(nodeEnv)
  const extracted = keys.filter(key => extractor && new RegExp(extractor).test(key))
  const selected = keys.filter(key => selectKeys.includes(key))

  const deriveNewKey = (current: string) => typeof replacer === 'function' ? replacer(current) : current

  const lambda = [...extracted, ...selected]
    .filter((elem, pos, arr) => arr.indexOf(elem) === pos)
    .reduce((acc, curr) => ({ ...acc, [deriveNewKey(curr)]: nodeEnv[curr] }), {})

  return !Object.keys(defaultValues).length ? lambda : {
    ...lambda,
    ...defaultValues
  }
}

export function onInit(ts: TransferState, env: any, stateKey: string) {
  const lambda = () => ts.set(makeStateKey(stateKey), env)
  return lambda
}

export function nodeEnvFactory() {
  return process.env
}

export function defaultReplaceExtract(extractionKey: string) {
  const lambda = (key: string) => key.replace(extractionKey, '')
  return lambda
}

export interface INodeEnvTransferServerModuleConfig {
  readonly selectKeys: ReadonlyArray<string>
  readonly extractor: string
}

@NgModule({
  imports: [
    ServerTransferStateModule,
    NodeEnvTransferModule
  ],
  providers: [
    {
      provide: NODE_ENV,
      useFactory: nodeEnvFactory
    },
    {
      provide: ENV_CONFIG_SERVER_EXTRACTOR,
      useValue: DEFAULT_ENV_CONFIG_EXTRACTOR
    },
    {
      provide: ENV_CONFIG_SERVER_REPLACER,
      useFactory: defaultReplaceExtract,
      deps: [ENV_CONFIG_SERVER_EXTRACTOR]
    },
    {
      provide: ENV_CONFIG_SERVER_SELECTED,
      useValue: DEFAULT_ENV_CONFIG_FILTER_KEYS
    },
    {
      provide: ENV,
      useFactory: serverEnvConfigFactory,
      deps: [NODE_ENV, NODE_ENV_USE_VALUES, ENV_CONFIG_SERVER_SELECTED, ENV_CONFIG_SERVER_EXTRACTOR, ENV_CONFIG_SERVER_REPLACER]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: onInit,
      deps: [TransferState, ENV, ENV_CONFIG_TS_KEY],
      multi: true
    }
  ]
})
export class NodeEnvTransferServerModule {
  static config(config: Partial<INodeEnvTransferServerModuleConfig> = {}): ModuleWithProviders {
    return {
      ngModule: NodeEnvTransferServerModule,
      providers: [
        {
          provide: ENV_CONFIG_SERVER_EXTRACTOR,
          useValue: config.extractor || DEFAULT_ENV_CONFIG_EXTRACTOR
        },
        {
          provide: ENV_CONFIG_SERVER_SELECTED,
          useValue: config.selectKeys || DEFAULT_ENV_CONFIG_FILTER_KEYS
        }
      ]
    }
  }
}
