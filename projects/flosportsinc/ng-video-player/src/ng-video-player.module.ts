import { NgModule } from '@angular/core'
import { FloVideoPlayerControlsModule } from '@flosportsinc/ng-video-player/controls'

@NgModule({
  imports: [FloVideoPlayerControlsModule],
  exports: [FloVideoPlayerControlsModule]
})
export class FloVideoPlayerModule { }
