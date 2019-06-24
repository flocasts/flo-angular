import { NgModule } from '@angular/core'
import { FloMediaPlayerControlPipNativeEnterDirective, FloMediaPlayerControlPipNativeExitDirective } from './mpc-pip-native.directive'
import { FloPictureInPictureNativeService } from './mpc-pip-native.service'

@NgModule({
  declarations: [FloMediaPlayerControlPipNativeEnterDirective, FloMediaPlayerControlPipNativeExitDirective],
  exports: [FloMediaPlayerControlPipNativeEnterDirective, FloMediaPlayerControlPipNativeExitDirective],
  providers: [FloPictureInPictureNativeService]
})
export class FloMediaPlayerControlsPipNativeModule { }
