import { NgModule, ModuleWithProviders } from '@angular/core'
import { WINDOW } from './window.tokens'
import { WindowCommonModule } from './window.common.module'

@NgModule({
  imports: [WindowCommonModule],
  exports: [WindowCommonModule]
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
