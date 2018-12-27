import { NgModule } from '@angular/core'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { WindowServerModule } from '@flosportsinc/ng-universal-services/src/window'
import { AdBlockServerModule } from '@flosportsinc/ng-universal-services/src/ad-block'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpRelativeInterceptor } from './relative'

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule,
    WindowServerModule.withWindowObject(),
    AdBlockServerModule
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
