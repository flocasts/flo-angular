import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { WindowServerModule } from '@flosportsinc/ng-universal-services/window/server'
import { AdBlockServerModule } from '@flosportsinc/ng-universal-services/ad-block'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpRelativeInterceptor } from './relative'
import { NodeEnvTransferServerModule } from '@flosportsinc/ng-universal-services/node-env-transfer/server'

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule,
    WindowServerModule,
    AdBlockServerModule,
    NodeEnvTransferServerModule
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
export class AppServerModule { }
