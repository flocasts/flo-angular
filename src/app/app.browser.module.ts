import { NgModule } from '@angular/core'
import { PwaService } from './pwa.service'
import { WindowModule } from '@flosportsinc/ng-services'
import { AppModule } from './app.module'
import { AppComponent } from './app.component'

@NgModule({
  imports: [
    AppModule,
    WindowModule
  ],
  providers: [
    PwaService
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }
