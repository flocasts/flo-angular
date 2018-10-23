import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { FramerComponent } from './viewport-grid/viewport-grid.component'
import { ViewportGridModule } from '@flosportsinc/ng-viewport-grid'
import { HlsJsModule } from '@flosportsinc/ng-hls'
import { HomeComponent } from './home/home.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HlsComponent } from './hls/hls.component'
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment'
import { PwaService } from './pwa.service'

@NgModule({
  declarations: [
    AppComponent,
    FramerComponent,
    HomeComponent,
    HlsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    ViewportGridModule,
    HlsJsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [PwaService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(_pwa: PwaService) {
    // none
  }
}
