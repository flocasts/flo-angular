import { NgModule, ModuleWithProviders } from '@angular/core'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { AD_BLOCK_PING_URL } from './ad-block.browser.tokens'
import { map, catchError, shareReplay } from 'rxjs/operators'
import { AD_BLOCK_LOADER } from './ad-block.tokens'
import { AdBlockModule } from './ad-block.module'
import { scheduled, asapScheduler } from 'rxjs'

const returnFalse = () => false
const returnTrusObs = () => scheduled([true], asapScheduler)

export function defaultBrowserLoader(http: HttpClient, pingUrl: string) {
  const func = http.get(pingUrl).pipe(map(returnFalse), catchError(returnTrusObs), shareReplay(1))
  return func
}

@NgModule({
  imports: [AdBlockModule, HttpClientModule]
})
export class AdBlockBrowserModule {
  static usingUrl(url: string): ModuleWithProviders {
    return {
      ngModule: AdBlockBrowserModule,
      providers: [
        {
          provide: AD_BLOCK_PING_URL,
          useValue: url
        },
        {
          provide: AD_BLOCK_LOADER,
          useFactory: defaultBrowserLoader,
          deps: [HttpClient, AD_BLOCK_PING_URL]
        }
      ]
    }
  }
}
