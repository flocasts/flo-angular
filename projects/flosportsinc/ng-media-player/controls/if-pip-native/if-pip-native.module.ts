import { NgModule } from '@angular/core'
import { FloMediaIfCanEnterPipNativeDirective, FloMediaIfCanExitPipNativeDirective } from './if-pip-native.directive'

@NgModule({
  declarations: [
    FloMediaIfCanEnterPipNativeDirective,
    FloMediaIfCanExitPipNativeDirective
  ],
  exports: [
    FloMediaIfCanEnterPipNativeDirective,
    FloMediaIfCanExitPipNativeDirective
  ]
})
export class FloMediaIfPipNativeModule { }
