import { NgModule } from '@angular/core'
import { FloVideoPlayerPauseControlDirective } from './vpc-pause.directive'
import { VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, defaultPauseFactoryFunction } from './vpc-pause.tokens'

@NgModule({
  declarations: [FloVideoPlayerPauseControlDirective],
  exports: [FloVideoPlayerPauseControlDirective],
  providers: [
    { provide: VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, useFactory: defaultPauseFactoryFunction }
  ]
})
export class FloVideoPlayerControlsPauseModule { }
