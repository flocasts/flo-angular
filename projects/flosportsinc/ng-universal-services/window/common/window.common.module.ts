import { NgModule } from '@angular/core'
import { WindowService } from './window.service'
import { WINDOW } from './window.tokens'

@NgModule({
  providers: [
    WindowService,
    {
      provide: WINDOW,
      useValue: {}
    }
  ]
})
export class WindowCommonModule { }
