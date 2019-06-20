import { NgModule } from '@angular/core'
import { FloVideoPlayerControlsPlayModule } from './vpc-play/vpc-play.module'
import { FloVideoPlayerControlsPauseModule } from './vpc-pause/vpc-pause.module'

@NgModule({
  imports: [
    FloVideoPlayerControlsPlayModule,
    FloVideoPlayerControlsPauseModule
  ],
  exports: [
    FloVideoPlayerControlsPlayModule,
    FloVideoPlayerControlsPauseModule
  ]
})
export class FloVideoPlayerControlsModule { }
