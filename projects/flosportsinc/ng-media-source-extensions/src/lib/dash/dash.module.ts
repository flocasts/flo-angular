import { NgModule } from '@angular/core'
import { DashDirective } from './dash.directive'
import { MseModule } from '@flosportsinc/ng-media-source-extensions'

@NgModule({
  imports: [MseModule],
  declarations: [DashDirective],
  exports: [MseModule, DashDirective]
})
export class DashModule { }
