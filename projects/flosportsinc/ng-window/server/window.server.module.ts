import { NgModule, ModuleWithProviders } from '@angular/core'
import { WINDOW } from './window.tokens'
import { WindowModule } from './window.common.module'

@NgModule({
  imports: [WindowModule]
})
export class WindowServerModule {
  static withWindowObject(windowObject = {}): ModuleWithProviders {
    return {
      ngModule: WindowServerModule,
      providers: [{
        provide: WINDOW,
        useValue: windowObject
      }]
    }
  }
}
