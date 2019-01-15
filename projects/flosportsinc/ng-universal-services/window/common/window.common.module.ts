import { NgModule } from '@angular/core'
import { WindowService } from './window.service'
import { WINDOW } from './window.tokens'

// for handling bundlers that might not have access to window object globally.
export function winFactory() {
  return typeof window !== 'undefined' ? window : {}
}

@NgModule({
  providers: [
    WindowService,
    {
      provide: WINDOW,
      useFactory: winFactory
    }
  ]
})
export class WindowModule { }
