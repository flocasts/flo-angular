import { NgModule, APP_BOOTSTRAP_LISTENER, ApplicationRef, ModuleWithProviders } from '@angular/core'
import { ServerTransferStateModule } from '@angular/platform-server'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { NodeEnvTransferModule } from './node-env-transfer.common.module'
import { NODE_ENV, ENV_CONFIG_FILTER_KEYS, ENV, ENV_CONFIG_TS_KEY } from './node-env-transfer.tokens'
import { filter, first, take } from 'rxjs/operators'

export function serverEnvConfigFactory(nodeEnv = {}, filterKeys: ReadonlyArray<string>) {
  const lamb = Object
    .keys(nodeEnv)
    .filter(key => filterKeys.includes(key))
    .reduce((acc, curr) => ({ ...acc, [curr]: nodeEnv[curr] }), {})
  return lamb
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

@NgModule({
  imports: [
    ServerTransferStateModule,
    NodeEnvTransferModule
  ],
  providers: [
    {
      provide: ENV_CONFIG_FILTER_KEYS,
      useValue: []
    },
    {
      provide: NODE_ENV,
      useFactory: nodeEnvFactory
    },
    {
      provide: ENV,
      useFactory: serverEnvConfigFactory,
      deps: [NODE_ENV, ENV_CONFIG_FILTER_KEYS]
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
  static withSelectedKeys(keys: ReadonlyArray<string> = []): ModuleWithProviders {
    return {
      ngModule: NodeEnvTransferServerModule,
      providers: [
        {
          provide: ENV_CONFIG_FILTER_KEYS,
          useValue: keys
        }
      ]
    }
  }
}
