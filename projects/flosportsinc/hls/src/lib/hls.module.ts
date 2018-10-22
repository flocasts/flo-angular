import { NgModule } from '@angular/core'
import { HlsDirective } from './hls.directive'

@NgModule({
  declarations: [HlsDirective],
  exports: [HlsDirective]
})
export class HlsModule { }
