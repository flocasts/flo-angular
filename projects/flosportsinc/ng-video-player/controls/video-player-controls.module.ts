import { NgModule } from '@angular/core'
import { FloVideoPlayerControlsPlayModule } from './vpc-play/vpc-play.module'
import { FloVideoPlayerControlsPauseModule } from './vpc-pause/vpc-pause.module'
import { FloVideoPlayerControlsVolumeModule } from './vpc-volume/vpc-volume.module'
import { FloVideoPlayerControlsPipModule } from './vpc-pip/vpc-pip.module'
import { FloVideoIfCanPlayModule } from './if-play/if-can-play.module'

@NgModule({
  imports: [
    FloVideoPlayerControlsPlayModule,
    FloVideoPlayerControlsPauseModule,
    FloVideoPlayerControlsVolumeModule,
    FloVideoPlayerControlsPipModule,

    FloVideoIfCanPlayModule
  ],
  exports: [
    FloVideoPlayerControlsPlayModule,
    FloVideoPlayerControlsPauseModule,
    FloVideoPlayerControlsVolumeModule,
    FloVideoPlayerControlsPipModule,

    FloVideoIfCanPlayModule
  ]
})
export class FloVideoPlayerControlsModule { }
