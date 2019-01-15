import { NgModule } from '@angular/core'
import { PwaService } from './pwa.service'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { DashModule } from '@flosportsinc/ng-media-source-extensions-dash'
import { HlsModule } from '@flosportsinc/ng-media-source-extensions-hls'
import { WindowBrowserModule } from '@flosportsinc/ng-universal-services/window/browser'
import { AdBlockBrowserModule } from '@flosportsinc/ng-universal-services/ad-block'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-universal-services/node-env-transfer/browser'

@NgModule({
  imports: [
    HlsModule,
    DashModule,
    AppModule,
    AdBlockBrowserModule.usingUrl('/assets/ads.js'),
    WindowBrowserModule,
    NodeEnvTransferBrowserModule
  ],
  providers: [
    PwaService
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }
