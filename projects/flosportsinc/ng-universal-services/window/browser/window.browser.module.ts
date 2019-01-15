import { NgModule } from '@angular/core'
import { WINDOW } from './window.tokens'
import { WindowCommonModule } from './window.common.module'

// for handling bundlers that might not have access to window object globally.
export function winFactory() {
  return typeof window !== 'undefined' ? window : {}
}

@NgModule({
  imports: [WindowCommonModule],
  providers: [
    {
      provide: WINDOW,
      useFactory: winFactory
    }
  ]
})
export class WindowBrowserModule { }
