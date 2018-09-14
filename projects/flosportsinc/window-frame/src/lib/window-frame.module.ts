import { NgModule } from '@angular/core'
import { WindowFrameComponent } from './window-frame.component'
import { WindowFrameDirective } from './window-frame.directive'

@NgModule({
  declarations: [WindowFrameComponent, WindowFrameDirective],
  exports: [WindowFrameComponent, WindowFrameDirective],
  entryComponents: [WindowFrameComponent]
})
export class WindowFrameModule { }
