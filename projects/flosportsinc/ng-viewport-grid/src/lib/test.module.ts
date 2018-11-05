import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ViewportGridComponent } from './viewport-grid.component'
import { ViewportGridBoxItemDirective } from './viewport-grid-box-item.directive'
import { ViewportGridBoxComponent } from './viewport-grid-box.component'

@NgModule({
  imports: [CommonModule],
  declarations: [
    ViewportGridComponent,
    ViewportGridBoxItemDirective,
    ViewportGridBoxComponent
  ],
  exports: [
    CommonModule,
    ViewportGridComponent,
    ViewportGridBoxItemDirective,
    ViewportGridBoxComponent
  ]
})
export class SharedTestingModule { }
