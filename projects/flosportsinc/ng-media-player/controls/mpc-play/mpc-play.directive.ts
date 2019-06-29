import { Directive, Input, HostListener, ElementRef, Inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase, coerceInputToBoolean } from '../mpc-base.directive'
import { VIDEO_PLAYER_CONTROLS_PLAY_FUNC, PlayControlFunction } from './mpc-play.tokens'

// tslint:disable: no-if-statement
// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword

@Directive({
  selector: '[floMp][floMpClickToPlay]',
})
export class FloVideoPlayerPlayControlDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    @Inject(VIDEO_PLAYER_CONTROLS_PLAY_FUNC) private func: PlayControlFunction,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _floMpClickToPlay?: string | boolean

  @Input()
  get floMpClickToPlay() {
    return this._floMpClickToPlay
  }
  set floMpClickToPlay(val: any) {
    this._floMpClickToPlay = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floMpClickToPlay) { return }

    this.maybeMediaElement().tapSome(ve => this.func(ve, this.elmRef, this.floMpMeta))
  }
}
