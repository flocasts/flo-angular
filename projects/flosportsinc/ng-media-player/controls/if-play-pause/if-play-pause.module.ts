import { NgModule } from '@angular/core'
import { FloMediaIfPausedDirective, FloMediaIfPlayingDirective } from './if-play-pause.directive'

@NgModule({
  declarations: [
    FloMediaIfPausedDirective,
    FloMediaIfPlayingDirective
  ],
  exports: [
    FloMediaIfPausedDirective,
    FloMediaIfPlayingDirective
  ]
})
export class FloMediaIfPlayPauseModule { }
