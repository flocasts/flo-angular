import { Directive, Input, HostListener, ElementRef, Inject, PLATFORM_ID } from '@angular/core'
import { VIDEO_PLAYER_CONTROLS_PLAY_FUNC, PlayControlFunction } from './video-player-play-control.tokens'
import { isPlatformBrowser } from '@angular/common'

// tslint:disable: no-if-statement

@Directive({
  selector: '[floVpcPlay]',
})
export class FloVideoPlayerPlayControlDirective<TMeta = any> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    @Inject(VIDEO_PLAYER_CONTROLS_PLAY_FUNC) private func: PlayControlFunction,
    @Inject(PLATFORM_ID) private platformId: string) { }

  @Input() readonly floVpcPlay?: HTMLVideoElement
  @Input() readonly floVpcPlayMeta?: TMeta

  @HostListener('click', [])
  click() {
    if (this.floVpcPlay && isPlatformBrowser(this.platformId) && this.floVpcPlay instanceof HTMLVideoElement) {
      this.func(this.floVpcPlay, this.elmRef, this.floVpcPlayMeta)
    }
  }
}
