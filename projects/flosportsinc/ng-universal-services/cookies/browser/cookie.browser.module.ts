import { NgModule } from '@angular/core'
import { CookieBrowserService } from './cookie.browser.service'
import { COOKIE_SERVICE } from './cookie.tokens'

@NgModule({
  providers: [{
    provide: COOKIE_SERVICE,
    useClass: CookieBrowserService
  }]
})
export class CookieBrowserModule { }
