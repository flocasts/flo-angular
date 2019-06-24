import { NgModule } from '@angular/core'
import { FloMediaPlayerControlPipDirective, FloMediaPlayerControlPipExitDirective } from './vpc-pip.directive'
import { FloPictureInPictureService } from './vpc-pip.service'

@NgModule({
  declarations: [FloMediaPlayerControlPipDirective, FloMediaPlayerControlPipExitDirective],
  exports: [FloMediaPlayerControlPipDirective, FloMediaPlayerControlPipExitDirective],
  providers: [FloPictureInPictureService]
})
export class FloMediaPlayerControlsPipModule { }
