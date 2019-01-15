import { NgModule, Injector, InjectionToken } from '@angular/core'
import { PwaService } from './pwa.service'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { DashModule } from '@flosportsinc/ng-media-source-extensions-dash'
import { HlsModule } from '@flosportsinc/ng-media-source-extensions-hls'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-universal-services/node-env-transfer/browser'
import { AdBlockBrowserModule } from '@flosportsinc/ng-universal-services/ad-block/browser'

@NgModule({
  imports: [
    AdBlockBrowserModule.usingUrl('/assets/ads.js'),
    NodeEnvTransferBrowserModule,
    HlsModule,
    DashModule,
    AppModule
  ],
  providers: [
    PwaService
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule {
}
