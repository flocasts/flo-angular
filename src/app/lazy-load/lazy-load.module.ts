import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LazyLoadComponent } from './lazy-load/lazy-load.component'
import { FloLazyLoadModule } from '@flosportsinc/ng-lazy-load'

@NgModule({
  declarations: [LazyLoadComponent],
  imports: [
    CommonModule,
    FloLazyLoadModule
  ],
  exports: [FloLazyLoadModule]
})
export class LazyLoadModule { }
