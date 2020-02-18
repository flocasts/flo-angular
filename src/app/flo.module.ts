import { NgModule } from '@angular/core'
import { FloMseModule } from '@flosportsinc/ng-media-source-extensions'
import { FloWindowModule } from '@flosportsinc/ng-window'
import { FloVideoAutoplayModule } from '@flosportsinc/ng-video-autoplay'
import { FloVideoEventsModule } from '@flosportsinc/ng-video-events'
import { FloGridListModule } from '@flosportsinc/ng-grid-list'
import { FloNodeEnvTransferModule } from '@flosportsinc/ng-env-transfer-state'
import { FloFullscreenModule } from '@flosportsinc/ng-fullscreen'
import { FloFetchFillModule } from '@flosportsinc/ng-fetch-fill'
import { SvgTransferStateModule } from '@flosportsinc/ng-svg-transfer-state'
import { FloAdBlockModule } from '@flosportsinc/ng-ad-block'
import { FloLazyLoadModule } from '@flosportsinc/ng-lazy-load'

@NgModule({
  imports: [
    FloAdBlockModule,
    FloVideoEventsModule,
    FloVideoAutoplayModule,
    FloFullscreenModule,
    FloMseModule,
    FloWindowModule,
    FloFetchFillModule,
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
    }),
    FloLazyLoadModule
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
    FloLazyLoadModule
  ]
})
export class FloModule { }
