import { NgModule } from '@angular/core'
import { VideoAutoplayDirective } from './ng-video-autoplay.directive'
import { VideoAutoplayContainerDirective } from './ng-video-autoplay-container.directive'

@NgModule({
  imports: [],
  declarations: [VideoAutoplayDirective, VideoAutoplayContainerDirective],
  exports: [VideoAutoplayDirective, VideoAutoplayContainerDirective]
})
export class FloVideoAutoplayModule { }
