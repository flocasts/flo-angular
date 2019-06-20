// import { VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, defaultPauseFactoryFunction } from './vpc-pause.tokens'
import { FloVideoPlayerControlVolumeDirective } from './vpc-volume.directive'
import { NgModule } from '@angular/core'

@NgModule({
  declarations: [FloVideoPlayerControlVolumeDirective],
  exports: [FloVideoPlayerControlVolumeDirective],
  providers: [
    // { provide: VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, useFactory: defaultPauseFactoryFunction }
  ]
})
export class FloVideoPlayerControlsVolumeModule { }
