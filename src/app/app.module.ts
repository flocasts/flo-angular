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
import { TransferHttpCacheModule } from '@nguniversal/common'
import { MarkdownModule } from 'ngx-markdown'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { NotFoundComponent } from './not-found/not-found.component'
import { UniversalServicesComponent } from './universal-services/universal-services.component'
import { HlsDemoComponent } from './hls/hls-demo/hls-demo.component'
import { HlsReadmeComponent } from './hls/hls-readme/hls-readme.component'

@NgModule({
  declarations: [
    AppComponent,
    FramerComponent,
    HomeComponent,
    HlsComponent,
    HlsDemoComponent,
    HlsReadmeComponent,
    UniversalServicesComponent,
    NotFoundComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ViewportGridModule,
    HlsJsModule,
    TransferHttpCacheModule,
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
  ]
})
export class AppModule { }
