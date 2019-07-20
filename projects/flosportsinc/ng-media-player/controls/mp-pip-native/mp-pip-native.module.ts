import { NgModule } from '@angular/core'
import { FloMediaPlayerControlPipNativeEnterDirective, FloMediaPlayerControlPipNativeExitDirective } from './mp-pip-native.directive'
import { FloPictureInPictureNativeService } from './mp-pip-native.service'

@NgModule({
  declarations: [FloMediaPlayerControlPipNativeEnterDirective, FloMediaPlayerControlPipNativeExitDirective],
  exports: [FloMediaPlayerControlPipNativeEnterDirective, FloMediaPlayerControlPipNativeExitDirective],
  providers: [FloPictureInPictureNativeService]
})
export class FloMediaPlayerControlsPipNativeModule { }
