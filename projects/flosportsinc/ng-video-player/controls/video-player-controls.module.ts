import { NgModule } from '@angular/core'
import { FloVideoPlayerControlsPlayModule } from './vpc-play/vpc-play.module'
import { FloVideoPlayerControlsPauseModule } from './vpc-pause/vpc-pause.module'
import { FloVideoPlayerControlsVolumeModule } from './vpc-volume/vpc-volume.module'
import { FloVideoPlayerControlsPipModule } from './vpc-pip/vpc-pip.module'

@NgModule({
  imports: [
    FloVideoPlayerControlsPlayModule,
    FloVideoPlayerControlsPauseModule,
    FloVideoPlayerControlsVolumeModule,
    FloVideoPlayerControlsPipModule
  ],
  exports: [
    FloVideoPlayerControlsPlayModule,
    FloVideoPlayerControlsPauseModule,
    FloVideoPlayerControlsVolumeModule,
    FloVideoPlayerControlsPipModule
  ]
})
export class FloVideoPlayerControlsModule { }
