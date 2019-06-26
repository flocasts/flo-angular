import { NgModule } from '@angular/core'
import { FloMediaIfUnmutedDirective, FloMediaIfMutedDirective } from './if-muted.directive'

@NgModule({
  declarations: [
    FloMediaIfMutedDirective,
    FloMediaIfUnmutedDirective
  ],
  exports: [
    FloMediaIfMutedDirective,
    FloMediaIfUnmutedDirective
  ]
})
export class FloMediaIfMutedModule { }
