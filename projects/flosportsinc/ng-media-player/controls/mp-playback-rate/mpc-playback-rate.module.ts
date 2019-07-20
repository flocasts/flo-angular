import { NgModule } from '@angular/core'
import { FloVideoPlayerPlaybackRateInputControlDirective } from './mpc-playback-rate.input.directive'

@NgModule({
  declarations: [FloVideoPlayerPlaybackRateInputControlDirective],
  exports: [FloVideoPlayerPlaybackRateInputControlDirective],
  providers: [
    // { provide: MEDIA_PLAYER_CONTROLS_ENABLE_REPEAT_FUNC, useFactory: defaultEnableRepeatFunction },
    // { provide: MEDIA_PLAYER_CONTROLS_DISABLE_REPEAT_FUNC, useFactory: defaultDisableRepeatFunction }
  ]
})
export class FloMediaPlayerControlsPlaybackRateModule { }
