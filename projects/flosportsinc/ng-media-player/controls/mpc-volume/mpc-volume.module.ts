// import { VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, defaultPauseFactoryFunction } from './vpc-pause.tokens'
import { FloMediaPlayerControlVolumeDirective } from './mpc-volume.directive'
import { NgModule } from '@angular/core'

@NgModule({
  declarations: [FloMediaPlayerControlVolumeDirective],
  exports: [FloMediaPlayerControlVolumeDirective],
  providers: [
    // { provide: VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, useFactory: defaultPauseFactoryFunction }
  ]
})
export class FloMediaPlayerControlsVolumeModule { }
