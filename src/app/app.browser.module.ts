import { NgModule } from '@angular/core'
import { PwaService } from './pwa.service'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { FloDashModule } from '@flosportsinc/ng-media-source-extensions/dash'
import { FloHlsModule } from '@flosportsinc/ng-media-source-extensions/hls'
import { FloNodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'
import { FloAdBlockBrowserModule } from '@flosportsinc/ng-ad-block/browser'
import { AdBlockService } from '@flosportsinc/ng-ad-block'
import { CookieBrowserModule } from '@flosportsinc/ng-universal-services/cookies/browser'
import { SvgTransferStateBrowserModule } from '@flosportsinc/ng-svg-transfer-state/browser'

@NgModule({
  imports: [
    FloAdBlockBrowserModule.usingUrl('/assets/ads.js'),
    CookieBrowserModule,
    AppModule,
    FloDashModule,
    FloHlsModule,
    FloNodeEnvTransferBrowserModule.config({
      mergeWithServer: {
        browserOnly: 'testing-123'
      }
    }),
    SvgTransferStateBrowserModule
  ],
  providers: [
    PwaService
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule {
  constructor(abs: AdBlockService) {
    abs.isAnAdBlockerActive().subscribe(isActive => console.log('Ad blocker detected:', isActive))
  }
}
