import { NgModule } from '@angular/core'
import { FloMediaPlayerControlsModule } from '@flosportsinc/ng-media-player/controls'
import { FloMediaPlayerControllerComponent } from './controller.component'
import { CommonModule } from '@angular/common'
import {
  FloMediaPlayerPlayBtnControlTemplateDirective,
  FloMediaPlayerPlayBtnControlContentTemplateDirective
} from './controller.directives'

@NgModule({
  imports: [
    CommonModule,
    FloMediaPlayerControlsModule
  ],
  declarations: [
    FloMediaPlayerControllerComponent,

    FloMediaPlayerPlayBtnControlTemplateDirective,
    FloMediaPlayerPlayBtnControlContentTemplateDirective
  ],
  exports: [
    FloMediaPlayerControlsModule,
    FloMediaPlayerControllerComponent,

    FloMediaPlayerPlayBtnControlTemplateDirective,
    FloMediaPlayerPlayBtnControlContentTemplateDirective
  ]
})
export class FloMediaPlayerControllerModule { }
