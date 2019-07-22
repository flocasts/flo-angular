import { NgModule } from '@angular/core'
// import { FloMediaPlayerControlsModule } from '@flosportsinc/ng-media-player/controls'
import { FloMediaPlayerControllerModule } from '@flosportsinc/ng-media-player/controller'

@NgModule({
  imports: [
    // FloMediaPlayerControlsModule,
    FloMediaPlayerControllerModule
  ],
  exports: [
    // FloMediaPlayerControlsModule,
    FloMediaPlayerControllerModule
  ]
})
export class FloMediaPlayerModule { }
