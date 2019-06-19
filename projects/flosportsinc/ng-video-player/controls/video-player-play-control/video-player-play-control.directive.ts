import { Directive, Input, HostListener, ElementRef, Inject } from '@angular/core'
import { VIDEO_PLAYER_CONTROLS_PLAY_FUNC, Te } from './video-player-play-control.tokens'

// tslint:disable: no-if-statement

@Directive({
  selector: '[floVpcPlay]',
})
export class FloVideoPlayerPlayControlDirective<TMeta = any> {
  constructor(private elmRef: ElementRef<HTMLElement>, @Inject(VIDEO_PLAYER_CONTROLS_PLAY_FUNC) private func: Te) { }

  @Input() readonly floVpcPlay?: HTMLVideoElement
  @Input() readonly floVpcPlayMeta?: TMeta

  @HostListener('click', [])
  click() {
    if (this.floVpcPlay && this.floVpcPlay instanceof HTMLVideoElement) {
      this.func(this.floVpcPlay, this.elmRef, this.floVpcPlayMeta)
    }
  }
}
