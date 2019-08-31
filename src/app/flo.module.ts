import { NgModule } from '@angular/core'
import { FloMseModule } from '@flosportsinc/ng-media-source-extensions'
import { FloWindowModule } from '@flosportsinc/ng-window'
import { FloVideoAutoplayModule } from '@flosportsinc/ng-video-autoplay'
import { FloVideoEventsModule } from '@flosportsinc/ng-video-events'
import { FloGridListModule } from '@flosportsinc/ng-grid-list'
import { FloNodeEnvTransferModule } from '@flosportsinc/ng-env-transfer-state'
import { FloFullscreenModule } from '@flosportsinc/ng-fullscreen'
import { FloFetchFillModule } from '@flosportsinc/ng-fetch-fill'
import { FloMediaPlayerModule } from '@flosportsinc/ng-media-player'
import { SvgTransferStateModule } from '@flosportsinc/ng-svg-transfer-state'
import { FloAdBlockModule } from '@flosportsinc/ng-ad-block'

@NgModule({
  imports: [
    FloAdBlockModule,
    FloVideoEventsModule,
    FloVideoAutoplayModule,
    FloFullscreenModule,
    FloMseModule,
    FloWindowModule,
    FloFetchFillModule,
    FloMediaPlayerModule,
    SvgTransferStateModule,
    FloGridListModule.config({
      count: 2,
      selectNextEmptyOnCount: true,
      selectNextEmptyOnAdd: true
    }),
    FloNodeEnvTransferModule.config({
      useValues: {
        manuallyShared: 'yay!'
      }
    })
  ],
  exports: [
    FloAdBlockModule,
    FloVideoEventsModule,
    FloVideoAutoplayModule,
    FloFullscreenModule,
    FloMseModule,
    FloWindowModule,
    FloFetchFillModule,
    SvgTransferStateModule,
    FloGridListModule,
    FloNodeEnvTransferModule,
    FloMediaPlayerModule
  ]
})
export class FloModule { }
