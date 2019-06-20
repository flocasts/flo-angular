import { NgModule } from '@angular/core'
import { FloVideoPlayerControlPipDirective } from './vpc-pip.directive'
import { VIDEO_PLAYER_CONTROLS_PIP_FUNC, defaultPipFactoryFunction } from './vpc-pip.tokens'

@NgModule({
  declarations: [FloVideoPlayerControlPipDirective],
  exports: [FloVideoPlayerControlPipDirective],
  providers: [
    { provide: VIDEO_PLAYER_CONTROLS_PIP_FUNC, useFactory: defaultPipFactoryFunction }
  ]
})
export class FloVideoPlayerControlsPipModule { }
