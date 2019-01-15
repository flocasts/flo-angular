import { NgModule } from '@angular/core'
import { AdBlockModule } from './ad-block.module'
import { shareReplay } from 'rxjs/operators'
import { AD_BLOCK_LOADER } from './ad-block.tokens'
import { of } from 'rxjs'

export function defaultServerLoader() {
  return of(false).pipe(shareReplay(1))
}

@NgModule({
  imports: [AdBlockModule],
  providers: [
    {
      provide: AD_BLOCK_LOADER,
      useFactory: defaultServerLoader
    }
  ]
})
export class AdBlockServerModule { }
