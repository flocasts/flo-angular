import { NgModule } from '@angular/core'
import { COOKIE_SERVICE } from '@flosportsinc/ng-universal-services/cookies'
import { CookieServerService } from './cookie.server.service'

@NgModule({
  providers: [{
    provide: COOKIE_SERVICE,
    useClass: CookieServerService
  }]
})
export class CookieServerModule { }
