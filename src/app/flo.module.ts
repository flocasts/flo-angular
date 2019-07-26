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

@NgModule({
  imports: [
    FloVideoEventsModule,
    FloVideoAutoplayModule,
    FloFullscreenModule,
    FloMseModule,
    FloWindowModule,
    FloFetchFillModule,
    SvgTransferStateModule,
    FloGridListModule.config({
      count: 2,
      autoSelectNextEmptyOnCountChange: true
    }),
    FloNodeEnvTransferModule.config({
      useValues: {
        manuallyShared: 'yay!'
      }
    })
  ],
  exports: [
    FloVideoEventsModule,
    FloVideoAutoplayModule,
    FloFullscreenModule,
    FloMseModule,
    FloWindowModule,
    FloFetchFillModule,
    SvgTransferStateModule,
    FloGridListModule,
    FloNodeEnvTransferModule
  ]
})
export class FloModule { }
