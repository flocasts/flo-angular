import { NgModule } from '@angular/core'
import { WindowFrameComponent } from './window-frame.component'
import { WindowPaneItemDirective } from './window-frame.directive'
import { WindowPaneComponent } from './window-pane.component'

@NgModule({
  declarations: [WindowFrameComponent, WindowPaneComponent, WindowPaneItemDirective],
  exports: [WindowFrameComponent, WindowPaneComponent, WindowPaneItemDirective],
  entryComponents: [WindowFrameComponent, WindowPaneComponent]
})
export class WindowFrameModule { }
