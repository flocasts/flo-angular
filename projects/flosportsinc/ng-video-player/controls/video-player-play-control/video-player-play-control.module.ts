import { NgModule } from '@angular/core'
import { FloVideoPlayerPlayControlDirective } from './video-player-play-control.directive'
import { VIDEO_PLAYER_CONTROLS_PLAY_FUNC, defaultPlayFactoryFunction } from './video-player-play-control.tokens'

@NgModule({
  declarations: [
    FloVideoPlayerPlayControlDirective
  ],
  exports: [
    FloVideoPlayerPlayControlDirective
  ],
  providers: [
    { provide: VIDEO_PLAYER_CONTROLS_PLAY_FUNC, useFactory: defaultPlayFactoryFunction }
  ]
})
export class FloVideoPlayerPlayControlsModule { }
