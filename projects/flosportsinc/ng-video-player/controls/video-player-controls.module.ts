import { NgModule } from '@angular/core'
import { FloVideoPlayerPlayControlsModule } from './vpc-play/vpc-play.module'

@NgModule({
  imports: [
    FloVideoPlayerPlayControlsModule
  ],
  exports: [
    FloVideoPlayerPlayControlsModule
  ]
})
export class FloVideoPlayerControlsModule { }
