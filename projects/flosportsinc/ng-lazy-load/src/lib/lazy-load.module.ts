import { NgModule } from '@angular/core'
import { FloLazyLoadDirective } from './lazy-load.directive'

@NgModule({
  exports: [FloLazyLoadDirective],
  declarations: [FloLazyLoadDirective]
})
export class FloLazyLoadModule {}
