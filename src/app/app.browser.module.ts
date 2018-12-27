import { NgModule } from '@angular/core'
import { PwaService } from './pwa.service'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { DashModule } from '@flosportsinc/ng-media-source-extensions-dash'
import { HlsModule } from '@flosportsinc/ng-media-source-extensions-hls'
import { WindowBrowserModule } from '@flosportsinc/ng-universal-services/src/window'
import { AdBlockBrowserModule, AdBlockService } from '@flosportsinc/ng-universal-services/src/ad-block'

@NgModule({
  imports: [
    HlsModule,
    DashModule,
    AppModule,
    AdBlockBrowserModule.usingUrl('/assets/ads.js'),
    WindowBrowserModule.withWindowObject()
  ],
  providers: [
    PwaService
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }
