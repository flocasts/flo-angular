import { NgModule } from '@angular/core'
import { FloVideoPlayerPlayControlsModule } from './video-player-play-control/video-player-play-control.module'

@NgModule({
  imports: [
    FloVideoPlayerPlayControlsModule
  ],
  exports: [
    FloVideoPlayerPlayControlsModule
  ]
})
export class FloVideoPlayerControlsModule { }
