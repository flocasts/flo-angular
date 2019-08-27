import { NgModule } from '@angular/core'
import { AdBlockService } from './ad-block.service'
import { FloIfAdBlockedDirective, FloIfNotAdBlockedDirective } from './ad-block.directive'

@NgModule({
  providers: [AdBlockService],
  declarations: [FloIfAdBlockedDirective, FloIfNotAdBlockedDirective],
  exports: [FloIfAdBlockedDirective, FloIfNotAdBlockedDirective]
})
export class FloAdBlockModule { }
