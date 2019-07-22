import { Component, Input, ChangeDetectionStrategy, ContentChild, TemplateRef } from '@angular/core'
import {
  FloMediaPlayerPlayBtnControlTemplateDirective,
  FloMediaPlayerPlayBtnControlContentTemplateDirective
} from './controller.directives'

@Component({
  selector: 'flo-media-player-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloMediaPlayerControllerComponent {

  @Input() readonly mediaRef: HTMLMediaElement
  @ContentChild(FloMediaPlayerPlayBtnControlTemplateDirective, { read: TemplateRef }) readonly floMpPlayTmpl: TemplateRef<HTMLElement>
  // tslint:disable-next-line: max-line-length
  @ContentChild(FloMediaPlayerPlayBtnControlContentTemplateDirective, { read: TemplateRef }) readonly floMpPlayTmplContent: TemplateRef<HTMLButtonElement>
  // @ContentChild(FloVideoPlayerPauseControlTemplateDirective, { read: TemplateRef }) readonly floMpPause: TemplateRef<HTMLElement>

  // tslint:disable: use-life-cycle-interface
  ngOnInit() {
    // tslint:disable-next-line: no-object-mutation
    this.mediaRef.controls = false
  }
}
