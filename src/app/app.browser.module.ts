import { NgModule } from '@angular/core'
import { PwaService } from './pwa.service'
import { WindowModule } from '@flosportsinc/ng-universal-services'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'
import { DashBrowserModule } from '@flosportsinc/ng-media-source-extensions'

@NgModule({
  imports: [
    AppModule,
    WindowModule,
    DashBrowserModule
  ],
  providers: [
    PwaService
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }
