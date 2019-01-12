import { NgModule, APP_BOOTSTRAP_LISTENER, ApplicationRef, ModuleWithProviders } from '@angular/core'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { filter, first, take } from 'rxjs/operators'
import { ENV_CONFIG, ENV_CONFIG_TS_KEY, ENV_CONFIG_FILTER_KEYS } from './node-env-transfer.tokens'
import { NodeEnvTransferCommonModule } from './node-env-transfer.common.module'

export function serverEnvConfigFactory(filterKeys: ReadonlyArray<string>) {
  const lamb = Object
    .keys(process.env || {})
    .filter(key => filterKeys.includes(key))
    .reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: process.env[curr]
      }
    }, {})
  return lamb
}

export function onBootstrap(appRef: ApplicationRef, ts: TransferState, env: any, stateKey: string) {
  const lambda = () => appRef.isStable
    .pipe(filter(Boolean), first(), take(1))
    .subscribe(() => ts.set(makeStateKey(stateKey), env))
  return lambda
}

@NgModule({
  imports: [NodeEnvTransferCommonModule],
  providers: [
    {
      provide: ENV_CONFIG_FILTER_KEYS,
      useValue: []
    },
    {
      provide: ENV_CONFIG,
      useFactory: serverEnvConfigFactory,
      deps: [ENV_CONFIG_FILTER_KEYS]
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: onBootstrap,
      deps: [ApplicationRef, TransferState, ENV_CONFIG, ENV_CONFIG_TS_KEY],
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
