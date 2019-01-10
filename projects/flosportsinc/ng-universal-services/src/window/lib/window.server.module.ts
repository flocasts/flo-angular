import { NgModule, ModuleWithProviders } from '@angular/core'
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
export class WindowServerModule {
  static withWindowObject(windowObject?: any): ModuleWithProviders {
    return {
      ngModule: WindowServerModule,
      providers: [{
        provide: WINDOW,
        useValue: windowObject
      }]
    }
  }
}
