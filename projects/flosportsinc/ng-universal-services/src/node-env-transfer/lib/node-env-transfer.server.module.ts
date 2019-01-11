import { NgModule, APP_BOOTSTRAP_LISTENER, ApplicationRef } from '@angular/core'
import { TransferState, makeStateKey } from '@angular/platform-browser'
import { filter, first, take } from 'rxjs/operators'
// import { REQUEST } from '@nguniversal/express-engine/tokens'
import { NodeEnvTransferService } from './node-env-transfer.service'
import { ENV_CONFIG } from './node-env-transfer.tokens'

// IF ENV CONTAINS SERVER_, remove from object
function removeServerSpecific(obj: { readonly [key: string]: string }, filterKey = 'SERVER_') {
  return Object.keys(obj)
    .filter(key => !key.includes(filterKey))
    .reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: obj[curr]
      }
    }, {})
}

export function serverEnvConfigFactory() {
  return JSON.parse('{}')
}

export function onBootstrap(appRef: ApplicationRef, ts: TransferState, env: any) {
  console.log(env)
  return () => {
    appRef.isStable
      .pipe(filter(Boolean), first(), take(1))
      .subscribe(() => {
        ts.set<any>(
          makeStateKey('123'),
          { test: 1 } as any
          // removeServerSpecific()
        )
      })
  }
}

@NgModule({
  providers: [
    NodeEnvTransferService,
    {
      provide: ENV_CONFIG,
      useFactory: serverEnvConfigFactory
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: onBootstrap,
      deps: [ApplicationRef, TransferState, ENV_CONFIG],
      multi: true
    }
  ]
})
export class NodeEnvTransferServerModule { }
