import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpRelativeInterceptor } from './relative'
import { FloWindowServerModule } from '@flosportsinc/ng-window/server'
import { FloAdBlockServerModule } from '@flosportsinc/ng-ad-block/server'
import { FloNodeEnvTransferServerModule } from '@flosportsinc/ng-env-transfer-state/server'
import { CookieServerModule } from '@flosportsinc/ng-universal-services/cookies/server'
import { SvgTransferStateServerModule } from '@flosportsinc/ng-svg-transfer-state/server'
import { HttpCacheTagExpressServerModule } from '@flosportsinc/ng-http-cache-tags'

@NgModule({
  imports: [
    ServerModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule,
    FloAdBlockServerModule,
    AppModule,
    FloWindowServerModule,
    CookieServerModule,
    FloNodeEnvTransferServerModule,
    HttpCacheTagExpressServerModule.config({
      cacheableResponseCodes: [200, 201]
    }),
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
