import { NgModule } from '@angular/core'
import { FloMediaPlayerMuteControlDirective } from './mp-mute.directive'
import { MEDIA_PLAYER_CONTROLS_MUTE_FUNC, defaultMuteFactoryFunction } from './mp-mute.tokens'

@NgModule({
  declarations: [FloMediaPlayerMuteControlDirective],
  exports: [FloMediaPlayerMuteControlDirective],
  providers: [
    { provide: MEDIA_PLAYER_CONTROLS_MUTE_FUNC, useFactory: defaultMuteFactoryFunction }
  ]
})
export class FloMediaPlayerControlsMuteModule { }
