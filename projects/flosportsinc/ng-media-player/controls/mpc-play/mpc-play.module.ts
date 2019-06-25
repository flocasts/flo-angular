import { NgModule } from '@angular/core'
import { FloVideoPlayerPlayControlDirective } from './mpc-play.directive'
import { VIDEO_PLAYER_CONTROLS_PLAY_FUNC, defaultPlayFactoryFunction } from './mpc-play.tokens'

@NgModule({
  declarations: [FloVideoPlayerPlayControlDirective],
  exports: [FloVideoPlayerPlayControlDirective],
  providers: [
    { provide: VIDEO_PLAYER_CONTROLS_PLAY_FUNC, useFactory: defaultPlayFactoryFunction }
  ]
})
export class FloMediaPlayerControlsPlayModule { }