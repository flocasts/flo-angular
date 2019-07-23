import { NgModule } from '@angular/core'
import { FloFullscreenModule } from '@flosportsinc/ng-fullscreen'
import { FloMediaPlayerControlsModule } from '@flosportsinc/ng-media-player/controls'
import { FloMediaPlayerControllerComponent } from './controller.component'
import { CommonModule } from '@angular/common'
import {
  FloMediaPlayerPlayBtnControlTemplateDirective,
  FloMediaPlayerPlayBtnControlContentTemplateDirective,
  FloMediaPlayerPauseBtnControlTemplateDirective,
  FloMediaPlayerPauseBtnControlContentTemplateDirective
} from './controller.directives'

@NgModule({
  imports: [
    CommonModule,
    FloFullscreenModule,
    FloMediaPlayerControlsModule
  ],
  declarations: [
    FloMediaPlayerControllerComponent,
    FloMediaPlayerPlayBtnControlTemplateDirective,
    FloMediaPlayerPlayBtnControlContentTemplateDirective,
    FloMediaPlayerPauseBtnControlTemplateDirective,
    FloMediaPlayerPauseBtnControlContentTemplateDirective
  ],
  exports: [
    FloMediaPlayerControlsModule,
    FloMediaPlayerControllerComponent,
    FloMediaPlayerPlayBtnControlTemplateDirective,
    FloMediaPlayerPlayBtnControlContentTemplateDirective,
    FloMediaPlayerPauseBtnControlTemplateDirective,
    FloMediaPlayerPauseBtnControlContentTemplateDirective
  ]
})
export class FloMediaPlayerControllerModule { }
