import { NgModule, APP_BOOTSTRAP_LISTENER, ApplicationRef, ModuleWithProviders } from '@angular/core'
import { ServerTransferStateModule } from '@angular/platform-server'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { NodeEnvTransferModule } from './node-env-transfer.common.module'
import { NODE_ENV, ENV_CONFIG_SERVER, ENV, ENV_CONFIG_TS_KEY } from './node-env-transfer.tokens'
import { filter, first, take } from 'rxjs/operators'

export function serverEnvConfigFactory(nodeEnv = {}, config: INodeEnvTransferServerModuleConfig) {
  const keys = Object.keys(nodeEnv)
  const extracted = keys.filter(key => config.extractor && config.extractor.test(key))
  const selected = keys.filter(key => config.selectKeys.includes(key))

  const lambda = [...extracted, ...selected]
    .filter((elem, pos, arr) => arr.indexOf(elem) === pos)
    .reduce((acc, curr) => {
      return {
        ...acc,
        [config.keyReplacer(curr)]: nodeEnv[curr]
      }
    }, {})
  return lambda
}

export function onBootstrap(appRef: ApplicationRef, ts: TransferState, env: any, stateKey: string) {
  const lambda = () => appRef.isStable
    .pipe(filter(Boolean), first(), take(1))
    .subscribe(() => ts.set(makeStateKey(stateKey), env))
  return lambda
}

export function nodeEnvFactory() {
  return process.env
}

export function defaultKeyReplacer(key: string) {
  return key
}

export interface INodeEnvTransferServerModuleConfig {
  readonly selectKeys: ReadonlyArray<string>
  readonly extractor?: RegExp
  readonly keyReplacer: (key: string) => string
}

const DEFAULT_ENV_CONFIG_FILTER_KEYS: ReadonlyArray<any> = []
const DEFAULT_ENV_CONFIG_KEY_REPLACER = defaultKeyReplacer
const DEFAULT_ENV_CONFIG_EXTRACTOR = undefined

export const DEFAULT_SERVER_CONFIG: INodeEnvTransferServerModuleConfig = {
  extractor: DEFAULT_ENV_CONFIG_EXTRACTOR,
  keyReplacer: DEFAULT_ENV_CONFIG_KEY_REPLACER,
  selectKeys: DEFAULT_ENV_CONFIG_FILTER_KEYS
}

@NgModule({
  imports: [
    ServerTransferStateModule,
    NodeEnvTransferModule
  ],
  providers: [
    {
      provide: ENV_CONFIG_SERVER,
      useValue: DEFAULT_SERVER_CONFIG
    },
    {
      provide: NODE_ENV,
      useFactory: nodeEnvFactory
    },
    {
      provide: ENV,
      useFactory: serverEnvConfigFactory,
      deps: [NODE_ENV, ENV_CONFIG_SERVER]
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: onBootstrap,
      deps: [ApplicationRef, TransferState, ENV, ENV_CONFIG_TS_KEY],
      multi: true
    }
  ]
})
export class NodeEnvTransferServerModule {
  static config(config: Partial<INodeEnvTransferServerModuleConfig>): ModuleWithProviders {
    return {
      ngModule: NodeEnvTransferServerModule,
      providers: [
        {
          provide: ENV_CONFIG_SERVER,
          useValue: {
            selectKeys: config.selectKeys || DEFAULT_ENV_CONFIG_FILTER_KEYS,
            extractor: config.extractor || DEFAULT_ENV_CONFIG_EXTRACTOR,
            keyReplacer: config.keyReplacer || DEFAULT_ENV_CONFIG_KEY_REPLACER
          } as INodeEnvTransferServerModuleConfig
        }
      ]
    }
  }
}
