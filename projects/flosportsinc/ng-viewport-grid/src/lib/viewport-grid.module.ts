import { NgModule } from '@angular/core'
import { ViewportGridComponent } from './viewport-grid.component'
import { ViewportGridBoxItemDirective } from './viewport-grid-box-item.directive'
import { ViewportGridBoxComponent } from './viewport-grid-box.component'
import { FloViewportManagerService } from './panel.service'

@NgModule({
  declarations: [
    ViewportGridComponent,
    ViewportGridBoxComponent,
    ViewportGridBoxItemDirective
  ],
  exports: [
    ViewportGridComponent,
    ViewportGridBoxComponent,
    ViewportGridBoxItemDirective
  ],
  providers: [
    FloViewportManagerService
  ],
  entryComponents: [
    ViewportGridComponent,
    ViewportGridBoxComponent
  ]
})
export class ViewportGridModule { }
