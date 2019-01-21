import { NgModule } from '@angular/core'
import { COOKIE_SERVICE } from './cookie.tokens'
import { CookieServerService } from './cookie.server.service'

@NgModule({
  providers: [{
    provide: COOKIE_SERVICE,
    useClass: CookieServerService
  }]
})
export class CookieServerModule { }
