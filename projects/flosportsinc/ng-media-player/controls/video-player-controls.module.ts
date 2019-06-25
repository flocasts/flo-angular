import { NgModule } from '@angular/core'
import { FloMediaPlayerControlsPlayModule } from './mpc-play/mpc-play.module'
import { FloMediaPlayerControlsPauseModule } from './mpc-pause/mpc-pause.module'
import { FloMediaPlayerControlsVolumeModule } from './mpc-volume/mpc-volume.module'
import { FloMediaPlayerControlsPipNativeModule } from './mpc-pip-native/mpc-pip-native.module'
import { FloMediaIfPlayPauseModule } from './if-play-pause/if-play-pause.module'
import { FloMediaIfPipNativeModule } from './if-pip-native/if-pip-native.module'

@NgModule({
  imports: [
    FloMediaPlayerControlsPlayModule,
    FloMediaPlayerControlsPauseModule,
    FloMediaPlayerControlsVolumeModule,
    FloMediaPlayerControlsPipNativeModule,

    FloMediaIfPlayPauseModule,
    FloMediaIfPipNativeModule
  ],
  exports: [
    FloMediaPlayerControlsPlayModule,
    FloMediaPlayerControlsPauseModule,
    FloMediaPlayerControlsVolumeModule,
    FloMediaPlayerControlsPipNativeModule,

    FloMediaIfPlayPauseModule,
    FloMediaIfPipNativeModule
  ]
})
export class FloMediaPlayerControlsModule { }
