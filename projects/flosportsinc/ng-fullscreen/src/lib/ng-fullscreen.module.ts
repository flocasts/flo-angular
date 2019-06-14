import { NgModule } from '@angular/core'
import { FloFullscreenDirective } from './ng-fullscreen.directive'
import { FloFullscreenService } from './ng-fullscreen.service'
import { FloFullscreenComponent } from './ng-fullscreen.component'

@NgModule({
  declarations: [FloFullscreenDirective, FloFullscreenComponent],
  exports: [FloFullscreenDirective, FloFullscreenComponent],
  providers: [FloFullscreenService]
})
export class FloFullscreenModule { }
