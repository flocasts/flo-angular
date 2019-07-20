import { NgModule } from '@angular/core'
import { FloMediaPlayerRepeatEnableControlDirective, FloMediaPlayerRepeatDisableControlDirective } from './mpc-repeat.directive'
import {
  MEDIA_PLAYER_CONTROLS_ENABLE_REPEAT_FUNC, MEDIA_PLAYER_CONTROLS_DISABLE_REPEAT_FUNC,
  defaultEnableRepeatFunction, defaultDisableRepeatFunction
} from './mpc-repeat.tokens'

@NgModule({
  declarations: [FloMediaPlayerRepeatEnableControlDirective, FloMediaPlayerRepeatDisableControlDirective],
  exports: [FloMediaPlayerRepeatEnableControlDirective, FloMediaPlayerRepeatDisableControlDirective],
  providers: [
    { provide: MEDIA_PLAYER_CONTROLS_ENABLE_REPEAT_FUNC, useFactory: defaultEnableRepeatFunction },
    { provide: MEDIA_PLAYER_CONTROLS_DISABLE_REPEAT_FUNC, useFactory: defaultDisableRepeatFunction }
  ]
})
export class FloMediaPlayerControlsRepeatModule { }
