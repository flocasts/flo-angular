import { NgModule } from '@angular/core'
import { FloMediaPlayerControlPipDirective } from './vpc-pip.directive'
import { MEDIA_PLAYER_CONTROLS_PIP_FUNC, defaultPipFactoryFunction } from './vpc-pip.tokens'

@NgModule({
  declarations: [FloMediaPlayerControlPipDirective],
  exports: [FloMediaPlayerControlPipDirective],
  providers: [
    { provide: MEDIA_PLAYER_CONTROLS_PIP_FUNC, useFactory: defaultPipFactoryFunction }
  ]
})
export class FloMediaPlayerControlsPipModule { }
