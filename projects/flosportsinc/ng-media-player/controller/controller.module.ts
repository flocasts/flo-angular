import { NgModule } from '@angular/core'
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
