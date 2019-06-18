import { NgModule } from '@angular/core'
import { FloFullscreenCommonModule } from './common/ng-fullscreen.module'
import { FloFullscreenToggleModule } from './toggle/ng-fullscreen.toggle.module'
import { FloFullscreenSwitchModule } from './switch/ng-fullscreen.switch.module'

@NgModule({
  imports: [
    FloFullscreenCommonModule,
    FloFullscreenSwitchModule,
    FloFullscreenToggleModule
  ],
  exports: [
    FloFullscreenCommonModule,
    FloFullscreenSwitchModule,
    FloFullscreenToggleModule
  ]
})
export class FloFullscreenModule { }
