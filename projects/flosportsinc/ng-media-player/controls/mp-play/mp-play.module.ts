import { NgModule } from '@angular/core'
import { FloMediaPlayerPlayControlDirective } from './mp-play.directive'
import { VIDEO_PLAYER_CONTROLS_PLAY_FUNC, defaultPlayFactoryFunction } from './mp-play.tokens'

@NgModule({
  declarations: [FloMediaPlayerPlayControlDirective],
  exports: [FloMediaPlayerPlayControlDirective],
  providers: [
    { provide: VIDEO_PLAYER_CONTROLS_PLAY_FUNC, useFactory: defaultPlayFactoryFunction }
  ]
})
export class FloMediaPlayerControlsPlayModule { }
