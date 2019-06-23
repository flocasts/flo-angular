import { Directive, Input, HostListener, ElementRef, Inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase, coerceInputToBoolean } from '../vpc-base.directive'
import { VIDEO_PLAYER_CONTROLS_PLAY_FUNC, PlayControlFunction } from './vpc-play.tokens'

// tslint:disable: no-if-statement
// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword

@Directive({
  selector: '[floMpc][floMpcPlay]',
})
export class FloVideoPlayerPlayControlDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    @Inject(VIDEO_PLAYER_CONTROLS_PLAY_FUNC) private func: PlayControlFunction,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _play?: string | boolean

  @Input()
  get floMpcPlay() {
    return this._play
  }
  set floMpcPlay(val: any) {
    this._play = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floMpcPlay) { return }

    this.maybeMediaElement().tapSome(ve => this.func(ve, this.elmRef, this.floMpcMeta))
  }
}
