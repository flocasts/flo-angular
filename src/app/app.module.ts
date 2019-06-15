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
import { MseModule } from '@flosportsinc/ng-media-source-extensions'
import { WindowModule } from '@flosportsinc/ng-window'
import { SvgTransferStateModule } from '@flosportsinc/ng-svg-transfer-state'
import { IconsComponent } from './icons/icons.component'
import { StylesComponent } from './styles/styles.component'
import { AutoplayComponent } from './autoplay/autoplay.component'
import { FloVideoAutoplayModule } from '@flosportsinc/ng-video-autoplay'
import { FloVideoEventsModule } from '@flosportsinc/ng-video-events'
import { FloGridListModule } from '@flosportsinc/ng-grid-list'
import { NodeEnvTransferModule } from '@flosportsinc/ng-env-transfer-state'
import { GridListComponent } from './grid-list/grid-list.component'
import { FullscreenComponent } from './fullscreen/fullscreen.component'
import { FloFullscreenModule } from '@flosportsinc/ng-fullscreen'

@NgModule({
  imports: [
    FloGridListModule.config({
      count: 2
    }),
    FloVideoEventsModule,
    FloVideoAutoplayModule,
    FloFullscreenModule,
    WindowModule,
    MseModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    TransferHttpCacheModule,
    HttpClientModule,
    SvgTransferStateModule,
    NodeEnvTransferModule.config({
      useValues: {
        manuallyShared: 'yay!'
      }
    }),
    MarkdownModule.forRoot({ loader: HttpClient }),
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
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
    NotFoundComponent,
  ]
})
export class AppModule { }
