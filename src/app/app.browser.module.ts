import { NgModule } from '@angular/core'
import { PwaService } from './pwa.service'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { DashModule } from '@flosportsinc/ng-media-source-extensions-dash'
import { HlsModule } from '@flosportsinc/ng-media-source-extensions-hls'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-universal-services/node-env-transfer/browser'
import { AdBlockBrowserModule } from '@flosportsinc/ng-ad-block/browser'
import { CookieBrowserModule } from '@flosportsinc/ng-universal-services/cookies/browser'
import { SvgTransferStateBrowserModule } from '@flosportsinc/ng-svg-transfer-state/browser'

@NgModule({
  imports: [
    AdBlockBrowserModule.usingUrl('/assets/ads.js'),
    NodeEnvTransferBrowserModule,
    CookieBrowserModule,
    HlsModule,
    DashModule,
    AppModule,
    SvgTransferStateBrowserModule
  ],
  providers: [
    PwaService
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule {
}
