import { NgModule } from '@angular/core'
import { FloVideoPlayerControlsPlayModule } from './vpc-play/vpc-play.module'
import { FloVideoPlayerControlsPauseModule } from './vpc-pause/vpc-pause.module'
import { FloVideoPlayerControlsVolumeModule } from './vpc-volume/vpc-pause.module'

@NgModule({
  imports: [
    FloVideoPlayerControlsPlayModule,
    FloVideoPlayerControlsPauseModule,
    FloVideoPlayerControlsVolumeModule
  ],
  exports: [
    FloVideoPlayerControlsPlayModule,
    FloVideoPlayerControlsPauseModule,
    FloVideoPlayerControlsVolumeModule
  ]
})
export class FloVideoPlayerControlsModule { }
