import { NgModule, ModuleWithProviders } from '@angular/core'
import { WindowService } from './window.service'
import { WINDOW } from './window.tokens'

@NgModule({
  providers: [
    WindowService,
    {
      provide: WINDOW,
      useValue: window
    }
  ]
})
export class WindowBrowserModule {
  static withWindowObject(windowObject?: any): ModuleWithProviders {
    return {
      ngModule: WindowBrowserModule,
      providers: [{
        provide: WINDOW,
        useValue: windowObject
      }]
    }
  }
}
