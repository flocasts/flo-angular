import { NgModule } from '@angular/core'
import { FloMediaPlayerPauseControlDirective } from './vpc-pause.directive'
import { VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, defaultPauseFactoryFunction } from './vpc-pause.tokens'

@NgModule({
  declarations: [FloMediaPlayerPauseControlDirective],
  exports: [FloMediaPlayerPauseControlDirective],
  providers: [
    { provide: VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, useFactory: defaultPauseFactoryFunction }
  ]
})
export class FloMediaPlayerControlsPauseModule { }
