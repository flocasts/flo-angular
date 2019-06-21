import { NgModule } from '@angular/core'
import { FloMediaPlayerControlsModule } from '@flosportsinc/ng-media-player/controls'

@NgModule({
  imports: [FloMediaPlayerControlsModule],
  exports: [FloMediaPlayerControlsModule]
})
export class FloMediaPlayerModule { }
