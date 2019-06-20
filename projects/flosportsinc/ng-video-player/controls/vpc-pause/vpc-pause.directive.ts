import { Directive, Input, HostListener, ElementRef, Inject, PLATFORM_ID } from '@angular/core'
import { VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, PauseControlFunction } from './vpc-pause.tokens'
import { isPlatformBrowser } from '@angular/common'

@Directive({
  selector: '[floVpcPause]',
})
export class FloVideoPlayerPauseControlDirective<TMeta = any> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    @Inject(VIDEO_PLAYER_CONTROLS_PAUSE_FUNC) private func: PauseControlFunction,
    @Inject(PLATFORM_ID) private platformId: string) { }

  @Input() readonly floVpcPause?: HTMLVideoElement
  @Input() readonly floVpcPauseMeta?: TMeta

  @HostListener('click', [])
  click() {
    // tslint:disable-next-line: no-if-statement
    if (this.floVpcPause && isPlatformBrowser(this.platformId) && this.floVpcPause instanceof HTMLVideoElement) {
      this.func(this.floVpcPause, this.elmRef, this.floVpcPauseMeta)
    }
  }
}
