import { NgModule } from '@angular/core'
import { FloMediaPlayerControlSkipBackDirective, FloMediaPlayerControlSkipForwardDirective } from './mpc-skip.directive'

@NgModule({
  declarations: [FloMediaPlayerControlSkipBackDirective, FloMediaPlayerControlSkipForwardDirective],
  exports: [FloMediaPlayerControlSkipBackDirective, FloMediaPlayerControlSkipForwardDirective],
  providers: []
})
export class FloMediaPlayerControlsSkipModule { }
