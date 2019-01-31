import { NgModule } from '@angular/core'
import { WindowService } from './window.service'
import { WINDOW, WINDOW_IS_DEFINED } from './window.tokens'

// for handling bundlers that might not have access to window object globally.
export function winFactory(isWindowDefined: boolean) {
  return isWindowDefined ? window : {}
}

export function isWindowDefinedFactory() {
  return typeof window !== 'undefined'
}

@NgModule({
  providers: [
    WindowService,
    {
      provide: WINDOW_IS_DEFINED,
      useFactory: isWindowDefinedFactory
    },
    {
      provide: WINDOW,
      useFactory: winFactory,
      deps: [WINDOW_IS_DEFINED]
    }
  ]
})
export class WindowModule { }
