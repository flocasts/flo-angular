import { NgModule } from '@angular/core'
import { FloMediaPlayerControlsPlayModule } from './mp-play/mp-play.module'
import { FloMediaPlayerControlsPauseModule } from './mp-pause/mp-pause.module'
import { FloMediaPlayerControlsVolumeModule } from './mp-volume/mp-volume.module'
import { FloMediaPlayerControlsPipNativeModule } from './mp-pip-native/mp-pip-native.module'
import { FloMediaPlayerControlsMuteModule } from './mp-mute/mp-mute.module'
import { FloMediaPlayerControlsUnmuteModule } from './mp-unmute/mp-unmute.module'
import { FloMediaPlayerControlsSkipModule } from './mp-skip/mp-skip.module'
import { FloMediaIfPlayPauseModule } from './if-play-pause/if-play-pause.module'
import { FloMediaIfPipNativeModule } from './if-pip-native/if-pip-native.module'
import { FloMediaIfAdjustableVolumeModule } from './if-adjustable-volume/if-adjustable-volume.module'
import { FloMediaIfMutedModule } from './if-muted/if-muted.module'
import { FloMediaPlayerControlsRepeatModule } from './mp-repeat/mpc-repeat.module'
import { FloMediaIfRepeatModule } from './if-repeat/if-repeat.module'
import { FloMediaPlayerControlsPlaybackRateModule } from './mp-playback-rate/mpc-playback-rate.module'
import { FloMediaPlayerControlsDurationModule } from './mp-duration/mp-duration.module'

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
    FloMediaPlayerControlsDurationModule,
    FloMediaIfPlayPauseModule,
    FloMediaIfPipNativeModule,
    FloMediaIfAdjustableVolumeModule,
    FloMediaIfMutedModule,
    FloMediaIfRepeatModule,
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
    FloMediaPlayerControlsDurationModule,
    FloMediaIfPlayPauseModule,
    FloMediaIfPipNativeModule,
    FloMediaIfAdjustableVolumeModule,
    FloMediaIfMutedModule,
    FloMediaIfRepeatModule
  ]
})
export class FloMediaPlayerControlsModule { }
