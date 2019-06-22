import { Directive, Input, HostListener, ElementRef, Inject, ChangeDetectorRef } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase, coerceInputToBoolean } from '../vpc-base.directive'
import { VIDEO_PLAYER_CONTROLS_PLAY_FUNC, PlayControlFunction } from './vpc-play.tokens'

// tslint:disable: no-if-statement
// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword

@Directive({
  selector: '[floVpc][floVpcPlay]',
})
export class FloVideoPlayerPlayControlDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    @Inject(VIDEO_PLAYER_CONTROLS_PLAY_FUNC) private func: PlayControlFunction) {
    super()
  }

  private _play?: string | boolean

  @Input()
  get floVpcPlay() {
    return this._play
  }
  set floVpcPlay(val: any) {
    this._play = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    if (!this.floVpcPlay) { return }

    this.cd.detectChanges()

    this.maybeMediaElement().tapSome(ve => this.func(ve, this.elmRef, this.floVpcMeta))
  }
}
