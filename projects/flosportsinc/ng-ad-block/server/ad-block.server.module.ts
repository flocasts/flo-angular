import { NgModule } from '@angular/core'
import { AdBlockModule, AD_BLOCK_LOADER } from '@flosportsinc/ng-ad-block'
import { shareReplay } from 'rxjs/operators'
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
