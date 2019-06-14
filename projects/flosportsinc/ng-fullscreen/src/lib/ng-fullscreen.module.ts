import { NgModule } from '@angular/core'
import { FloFullscreenDirective } from './ng-fullscreen.directive'
import { FloFullscreenService } from './ng-fullscreen.service'

@NgModule({
  declarations: [FloFullscreenDirective],
  exports: [FloFullscreenDirective],
  providers: [FloFullscreenService]
})
export class FloFullscreenModule { }
