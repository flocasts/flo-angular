import { Directive, Input, HostListener, ElementRef, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core'
import { FloVideoPlayerControlDirectiveBase, coerceInputToBoolean } from '../vpc-base.directive'
import { VIDEO_PLAYER_CONTROLS_PLAY_FUNC, PlayControlFunction } from './vpc-play.tokens'

// tslint:disable: no-if-statement

@Directive({
  selector: '[floVpc][floVpcPlay]',
})
export class FloVideoPlayerPlayControlDirective<TMeta = any> extends FloVideoPlayerControlDirectiveBase<TMeta> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    @Inject(VIDEO_PLAYER_CONTROLS_PLAY_FUNC) private func: PlayControlFunction,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  // tslint:disable-next-line: readonly-keyword
  private _play?: string | boolean

  @Input()
  get floVpcPlay() {
    return this._play
  }
  set floVpcPlay(val: any) {
    // tslint:disable-next-line: no-object-mutation
    this._play = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floVpcPlay) { return }

    this.maybeVideoElement().tapSome(ve => this.func(ve, this.elmRef, this.floVpcMeta))
  }
}
