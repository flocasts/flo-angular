import { NgModule } from '@angular/core'
import { FloMediaPlayerControlsPlayModule } from './mpc-play/mpc-play.module'
import { FloMediaPlayerControlsPauseModule } from './mpc-pause/mpc-pause.module'
import { FloMediaPlayerControlsVolumeModule } from './mpc-volume/mpc-volume.module'
import { FloMediaPlayerControlsPipNativeModule } from './mpc-pip-native/mpc-pip-native.module'
import { FloMediaPlayerControlsMuteModule } from './mpc-mute/mpc-mute.module'
import { FloMediaPlayerControlsUnmuteModule } from './mpc-unmute/mpc-unmute.module'
import { FloMediaPlayerControlsSkipModule } from './mpc-skip/mpc-skip.module'
import { FloMediaIfPlayPauseModule } from './if-play-pause/if-play-pause.module'
import { FloMediaIfPipNativeModule } from './if-pip-native/if-pip-native.module'
import { FloMediaIfAdjustableVolumeModule } from './if-adjustable-volume/if-adjustable-volume.module'
import { FloMediaIfMutedModule } from './if-muted/if-muted.module'
import { FloMediaPlayerControlsRepeatModule } from './mpc-repeat/mpc-repeat.module'
import { FloMediaIfRepeatModule } from './if-repeat/if-repeat.module'

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
    FloMediaIfPlayPauseModule,
    FloMediaIfPipNativeModule,
    FloMediaIfAdjustableVolumeModule,
    FloMediaIfMutedModule,
    FloMediaIfRepeatModule
  ]
})
export class FloMediaPlayerControlsModule { }
