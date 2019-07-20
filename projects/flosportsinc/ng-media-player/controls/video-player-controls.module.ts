import { NgModule } from '@angular/core'
import { FloMediaPlayerControlsPlayModule } from './mp-play/mpc-play.module'
import { FloMediaPlayerControlsPauseModule } from './mp-pause/mpc-pause.module'
import { FloMediaPlayerControlsVolumeModule } from './mp-volume/mpc-volume.module'
import { FloMediaPlayerControlsPipNativeModule } from './mp-pip-native/mpc-pip-native.module'
import { FloMediaPlayerControlsMuteModule } from './mp-mute/mpc-mute.module'
import { FloMediaPlayerControlsUnmuteModule } from './mp-unmute/mpc-unmute.module'
import { FloMediaPlayerControlsSkipModule } from './mp-skip/mpc-skip.module'
import { FloMediaIfPlayPauseModule } from './if-play-pause/if-play-pause.module'
import { FloMediaIfPipNativeModule } from './if-pip-native/if-pip-native.module'
import { FloMediaIfAdjustableVolumeModule } from './if-adjustable-volume/if-adjustable-volume.module'
import { FloMediaIfMutedModule } from './if-muted/if-muted.module'
import { FloMediaPlayerControlsRepeatModule } from './mp-repeat/mpc-repeat.module'
import { FloMediaIfRepeatModule } from './if-repeat/if-repeat.module'
import { FloMediaPlayerControlsPlaybackRateModule } from './mp-playback-rate/mpc-playback-rate.module'

@NgModule({
  imports: [
    FloMediaPlayerControlsPlayModule,
    FloMediaPlayerControlsPauseModule,
    FloMediaPlayerControlsVolumeModule,
    FloMediaPlayerControlsPipNativeModule,
    FloMediaPlayerControlsMuteModule,
    FloMediaPlayerControlsUnmuteModule,
    FloMediaPlayerControlsSkipModule,
    FloMediaPlayerControlsRepeatModule,
    FloMediaPlayerControlsPlaybackRateModule,
    FloMediaIfPlayPauseModule,
    FloMediaIfPipNativeModule,
    FloMediaIfAdjustableVolumeModule,
    FloMediaIfMutedModule,
    FloMediaIfRepeatModule
  ],
  exports: [
    FloMediaPlayerControlsPlayModule,
    FloMediaPlayerControlsPauseModule,
    FloMediaPlayerControlsVolumeModule,
    FloMediaPlayerControlsPipNativeModule,
    FloMediaPlayerControlsMuteModule,
    FloMediaPlayerControlsUnmuteModule,
    FloMediaPlayerControlsSkipModule,
    FloMediaPlayerControlsRepeatModule,
    FloMediaPlayerControlsPlaybackRateModule,
    FloMediaIfPlayPauseModule,
    FloMediaIfPipNativeModule,
    FloMediaIfAdjustableVolumeModule,
    FloMediaIfMutedModule,
    FloMediaIfRepeatModule
  ]
})
export class FloMediaPlayerControlsModule { }
