import { NgModule } from '@angular/core'
import { WindowService } from './window.service'
import { WINDOW } from './tokens'

@NgModule({
  providers: [
    {
      provide: WINDOW,
      useValue: window
    },
    WindowService
  ]
})
export class WindowModule { }
