import { NgModule } from '@angular/core'
import { FloMediaPlayerUnmuteControlDirective } from './mpc-unmute.directive'
import { MEDIA_PLAYER_CONTROLS_UNMUTE_FUNC, defaultUnmuteFactoryFunction } from './mpc-unmute.tokens'

@NgModule({
  declarations: [FloMediaPlayerUnmuteControlDirective],
  exports: [FloMediaPlayerUnmuteControlDirective],
  providers: [
    { provide: MEDIA_PLAYER_CONTROLS_UNMUTE_FUNC, useFactory: defaultUnmuteFactoryFunction }
  ]
})
export class FloMediaPlayerControlsUnmuteModule { }
