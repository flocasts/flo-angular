import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { FramerComponent } from './viewport-grid/viewport-grid.component'
import { ViewportGridModule } from '@flosportsinc/ng-viewport-grid'
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
import { NodeEnvTransferModule, NodeEnvTransferService } from '@flosportsinc/ng-env-transfer-state'
import { StylesComponent } from './styles/styles.component'
import { AutoplayComponent } from './autoplay/autoplay.component'
import { FloVideoAutoplayModule } from '@flosportsinc/ng-video-autoplay'
import { FloVideoEventsModule, VIDEO_PLAYER_EVENT_BINDINGS, ListenerDictionary } from '@flosportsinc/ng-video-events'
import { interval } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { ImaComponent } from './ima/ima.component'

export const fact1: ListenerDictionary = {
  pause: (a, b, c, d) => {
    // console.log(a, b, c, d)
  },
  play: (a, b, c, d, e, f, onDestroy) => {
    f(e)
  },
  canplay: (a, b, c, d, e, f, onDestroy) => {
    interval(1000).pipe(takeUntil(onDestroy)).subscribe(console.log)
  }
}

// export const fact2 = {
//   pause: (a, b, c, d) => {
//     console.log(a, b, c, d)
//   },
//   play: (a, b, c, d) => {
//     console.log(a, b, c, d)
//   },
//   canplay: (a, b, c, d) => {
//     console.log(a, b, c, d)
//   }
// }

@NgModule({
  imports: [
    FloVideoEventsModule,
    FloVideoAutoplayModule,
    NodeEnvTransferModule,
    WindowModule,
    MseModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ViewportGridModule,
    TransferHttpCacheModule,
    HttpClientModule,
    SvgTransferStateModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent,
    FramerComponent,
    HomeComponent,
    IconsComponent,
    HlsComponent,
    HlsDemoComponent,
    HlsReadmeComponent,
    HlsApiComponent,
    UniversalServicesComponent,
    StylesComponent,
    ImaComponent,
    AutoplayComponent,
    NotFoundComponent
  ],
  providers: [
    {
      provide: VIDEO_PLAYER_EVENT_BINDINGS,
      useValue: fact1,
      multi: true
    },
    // {
    //   provide: VIDEO_PLAYER_EVENT_BINDINGS,
    //   useValue: fact2,
    //   multi: true
    // }
  ]
})
export class AppModule {
  constructor(env: NodeEnvTransferService) {
    console.log(env.env)
  }
}
