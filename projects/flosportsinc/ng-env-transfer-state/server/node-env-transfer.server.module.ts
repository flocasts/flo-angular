import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core'
import { ServerTransferStateModule } from '@angular/platform-server'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import {
  NODE_ENV, ENV, ENV_CONFIG_TS_KEY, ENV_CONFIG_SERVER_EXTRACTOR,
  ENV_CONFIG_SERVER_REPLACER, ENV_CONFIG_SERVER_SELECTED, NODE_ENV_USE_VALUES,
  FloNodeEnvTransferModule
} from '@flosportsinc/ng-env-transfer-state'

export const DEFAULT_ENV_CONFIG_FILTER_KEYS: ReadonlyArray<string> = []
export const DEFAULT_ENV_CONFIG_EXTRACTOR = 'NG_'
export const DEFAULT_NODE_ENV_USE_VALUES = {}

export function serverEnvConfigFactory(nodeEnv = {},
  merge: INodeEnvTransferServerModuleConfigDict,
  selectKeys: ReadonlyArray<string>,
  extractor: string,
  replacer: (key: string) => string) {
  const keys = Object.keys(nodeEnv)
  const extracted = keys.filter(key => extractor && new RegExp(extractor).test(key))
  const selected = keys.filter(key => selectKeys.includes(key))

  const deriveNewKey = (current: string) => typeof replacer === 'function' ? replacer(current) : current

  const lambda = [...extracted, ...selected]
    .filter((elem, pos, arr) => arr.indexOf(elem) === pos)
    .reduce((acc, curr) => ({ ...acc, [deriveNewKey(curr)]: nodeEnv[curr] }), {})

  return !Object.keys(merge).length ? lambda : {
    ...lambda,
    ...merge
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

export interface INodeEnvTransferServerModuleConfigDict {
  readonly [key: string]: string | boolean | undefined
}

export interface INodeEnvTransferServerModuleConfig {
  readonly selectKeys: ReadonlyArray<string>
  readonly extractor: string
  readonly mergeWithEnv?: INodeEnvTransferServerModuleConfigDict
}

@NgModule({
  imports: [
    ServerTransferStateModule,
    FloNodeEnvTransferModule
  ],
  providers: [
    { provide: NODE_ENV, useFactory: nodeEnvFactory },
    { provide: ENV_CONFIG_SERVER_EXTRACTOR, useValue: DEFAULT_ENV_CONFIG_EXTRACTOR },
    {
      provide: ENV_CONFIG_SERVER_REPLACER,
      useFactory: defaultReplaceExtract,
      deps: [ENV_CONFIG_SERVER_EXTRACTOR]
    },
    { provide: ENV_CONFIG_SERVER_SELECTED, useValue: DEFAULT_ENV_CONFIG_FILTER_KEYS },
    { provide: NODE_ENV_USE_VALUES, useValue: DEFAULT_NODE_ENV_USE_VALUES },
    {
      provide: ENV,
      useFactory: serverEnvConfigFactory,
      deps: [
        NODE_ENV, NODE_ENV_USE_VALUES, ENV_CONFIG_SERVER_SELECTED,
        ENV_CONFIG_SERVER_EXTRACTOR, ENV_CONFIG_SERVER_REPLACER
      ]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: onInit,
      deps: [TransferState, ENV, ENV_CONFIG_TS_KEY],
      multi: true
    }
  ]
})
export class FloNodeEnvTransferServerModule {
  static config(config: Partial<INodeEnvTransferServerModuleConfig> = {}): ModuleWithProviders {
    return {
      ngModule: FloNodeEnvTransferServerModule,
      providers: [
        {
          provide: ENV_CONFIG_SERVER_EXTRACTOR,
          useValue: config.extractor || DEFAULT_ENV_CONFIG_EXTRACTOR
        },
        {
          provide: ENV_CONFIG_SERVER_SELECTED,
          useValue: config.selectKeys || DEFAULT_ENV_CONFIG_FILTER_KEYS
        },
        {
          provide: NODE_ENV_USE_VALUES,
          useValue: config.mergeWithEnv || DEFAULT_NODE_ENV_USE_VALUES
        }
      ]
    }
  }
}
