import { NgModule } from '@angular/core'
import { FloFullscreenCommonModule } from '../common/ng-fullscreen.module'
import { FloClickToExitFullscreenDirective, FloClickToEnterFullscreenDirective } from './ng-fullscreen.toggle.directive'

@NgModule({
  imports: [FloFullscreenCommonModule],
  declarations: [
    FloClickToEnterFullscreenDirective,
    FloClickToExitFullscreenDirective
  ],
  exports: [
    FloClickToEnterFullscreenDirective,
    FloClickToExitFullscreenDirective
  ]
})
export class FloFullscreenToggleModule { }
