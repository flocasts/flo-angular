import { NgModule, ModuleWithProviders } from '@angular/core'
import { WindowService } from './window.service'
import { WINDOW } from './window.tokens'

@NgModule({
  providers: [
    WindowService,
    {
      provide: WINDOW,
      useValue: typeof window !== 'undefined' ? window : {}
    }
  ]
})
export class WindowBrowserModule { }
