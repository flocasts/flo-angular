import { NgModule } from '@angular/core'
import { FloIfPlayVideoControlDirective, FloIfNotPlayVideoControlDirective } from './if-can-play.directive'

@NgModule({
  declarations: [
    FloIfPlayVideoControlDirective,
    FloIfNotPlayVideoControlDirective
  ],
  exports: [
    FloIfPlayVideoControlDirective,
    FloIfNotPlayVideoControlDirective
  ],
})
export class FloVideoIfCanPlayModule { }
