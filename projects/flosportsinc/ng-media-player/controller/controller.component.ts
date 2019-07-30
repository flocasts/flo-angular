import { Component, Input, ChangeDetectionStrategy, ContentChild, TemplateRef, HostBinding, HostListener, ElementRef } from '@angular/core'
import {
  FloMediaPlayerPlayBtnControlTemplateDirective,
  FloMediaPlayerPlayBtnControlContentTemplateDirective,
  FloMediaPlayerPauseBtnControlTemplateDirective,
  FloMediaPlayerPauseBtnControlContentTemplateDirective
} from './controller.directives'

@Component({
  selector: 'flo-media-player-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloMediaPlayerControllerComponent {
  constructor(private elm: ElementRef<HTMLDivElement>) {}

  // tslint:disable: readonly-keyword
  @HostBinding('class.fs') readonly fs  = true
  @HostBinding('class.mp') readonly mp  = true
  @HostBinding('class.controller') readonly controller  = true
  @HostBinding('class.hide')
  get hidden() {
    return false // !this.mediaRef || this.mediaRef.controls
  }

  @HostListener('mousedown', ['$event'])
  mousedown(evt: MouseEvent) {
    // tslint:disable-next-line: no-if-statement
    if (!(evt.target instanceof HTMLInputElement)) {
      evt.preventDefault()
    }
  }

  @Input() readonly mediaRef: HTMLMediaElement

  @ContentChild(FloMediaPlayerPlayBtnControlTemplateDirective, { read: TemplateRef })
  readonly floMpPlayTmpl: TemplateRef<HTMLElement>

  @ContentChild(FloMediaPlayerPlayBtnControlContentTemplateDirective, { read: TemplateRef })
  readonly floMpPlayTmplContent: TemplateRef<HTMLButtonElement>

  @ContentChild(FloMediaPlayerPauseBtnControlTemplateDirective, { read: TemplateRef })
  readonly floMpPauseTmpl: TemplateRef<HTMLElement>

  @ContentChild(FloMediaPlayerPauseBtnControlContentTemplateDirective, { read: TemplateRef })
  readonly floMpPauseContentTmpl: TemplateRef<HTMLButtonElement>

  // tslint:disable: use-life-cycle-interface
  ngOnInit() {
    // TODO: !!
    // tslint:disable-next-line: no-object-mutation
  }
}
