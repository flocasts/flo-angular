import { NgModule } from '@angular/core'
import { FloFullscreenCommonModule } from '../common/ng-fullscreen.module'
import { FloFullscreenOnDirective, FloFullscreenOffDirective } from './ng-fullscreen.switch.directive'

@NgModule({
  imports: [FloFullscreenCommonModule],
  declarations: [
    FloFullscreenOnDirective,
    FloFullscreenOffDirective
  ],
  exports: [
    FloFullscreenOnDirective,
    FloFullscreenOffDirective
  ]
})
export class FloFullscreenSwitchModule { }
