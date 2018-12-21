import { NgModule } from '@angular/core'
import { PwaService } from './pwa.service'
import { WindowModule } from '@flosportsinc/ng-universal-services'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { DashModule } from '@flosportsinc/ng-media-source-extensions-dash'
import { HlsModule } from '@flosportsinc/ng-media-source-extensions-hls'

@NgModule({
  imports: [
    HlsModule,
    DashModule,
    AppModule,
    WindowModule
  ],
  providers: [
    PwaService
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }
