import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
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
import { HlsApiComponent } from './hls/hls-api/hls-api.component'
import { IconsComponent } from './icons/icons.component'
import { StylesComponent } from './styles/styles.component'
import { AutoplayComponent } from './autoplay/autoplay.component'
import { GridListComponent } from './grid-list/grid-list.component'
import { FullscreenComponent } from './fullscreen/fullscreen.component'
import { FloModule } from './flo.module'
import { FetchFillComponent } from './fetch-fill/fetch-fill.component'
import {LazyLoadComponent} from './lazy-load/lazy-load.component'

@NgModule({
  imports: [
    FloModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    TransferHttpCacheModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    IconsComponent,
    HlsComponent,
    HlsDemoComponent,
    HlsReadmeComponent,
    HlsApiComponent,
    UniversalServicesComponent,
    StylesComponent,
    AutoplayComponent,
    GridListComponent,
    FullscreenComponent,
    FetchFillComponent,
    NotFoundComponent,
    LazyLoadComponent
  ]
})
export class AppModule { }
