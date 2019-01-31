import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpRelativeInterceptor } from './relative'
import { WindowServerModule } from '@flosportsinc/ng-window/server'
import { AdBlockServerModule } from '@flosportsinc/ng-ad-block/server'
import { NodeEnvTransferServerModule } from '@flosportsinc/ng-universal-services/node-env-transfer/server'
import { CookieServerModule } from '@flosportsinc/ng-universal-services/cookies/server'
import { SvgTransferStateServerModule } from '@flosportsinc/ng-svg-transfer-state/server'

@NgModule({
  imports: [
    ServerModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule,
    AdBlockServerModule,
    NodeEnvTransferServerModule,
    AppModule,
    WindowServerModule,
    CookieServerModule,
    SvgTransferStateServerModule.withSvgAssetRoot('dist/flo-angular/browser/assets/svg')
  ],
  providers: [
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRelativeInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {
}
