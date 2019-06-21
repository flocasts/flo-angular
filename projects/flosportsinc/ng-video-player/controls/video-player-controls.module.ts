import { NgModule } from '@angular/core'
import { FloMediaPlayerControlsPlayModule } from './vpc-play/vpc-play.module'
import { FloMediaPlayerControlsPauseModule } from './vpc-pause/vpc-pause.module'
import { FloMediaPlayerControlsVolumeModule } from './vpc-volume/vpc-volume.module'
import { FloMediaPlayerControlsPipModule } from './vpc-pip/vpc-pip.module'
import { FloMediaIfPlayPauseModule } from './if-play-pause/if-play-pause.module'

@NgModule({
  imports: [
    FloMediaPlayerControlsPlayModule,
    FloMediaPlayerControlsPauseModule,
    FloMediaPlayerControlsVolumeModule,
    FloMediaPlayerControlsPipModule,

    FloMediaIfPlayPauseModule
  ],
  exports: [
    FloMediaPlayerControlsPlayModule,
    FloMediaPlayerControlsPauseModule,
    FloMediaPlayerControlsVolumeModule,
    FloMediaPlayerControlsPipModule,

    FloMediaIfPlayPauseModule
  ]
})
export class FloMediaPlayerControlsModule { }
