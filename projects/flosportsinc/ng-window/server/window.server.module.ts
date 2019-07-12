import { NgModule, ModuleWithProviders } from '@angular/core'
import { FloWindowModule, WINDOW } from '@flosportsinc/ng-window'

@NgModule({
  imports: [FloWindowModule]
})
export class FloWindowServerModule {
  static withWindowObject(windowObject = {}): ModuleWithProviders {
    return {
      ngModule: FloWindowServerModule,
      providers: [{
        provide: WINDOW,
        useValue: windowObject
      }]
    }
  }
}
