import { NgModule } from '@angular/core'
import { MseDirective } from './mse.directive'

@NgModule({
  declarations: [MseDirective],
  exports: [MseDirective]
})
export class MseModule { }
