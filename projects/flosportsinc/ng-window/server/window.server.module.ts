import { NgModule, ModuleWithProviders } from '@angular/core'
import { WindowModule, WINDOW } from '@flosportsinc/ng-window'

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
