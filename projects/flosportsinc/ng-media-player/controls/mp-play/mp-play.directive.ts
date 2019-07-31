import { Directive, Input, HostListener, ElementRef, Inject, ChangeDetectorRef } from '@angular/core'
import { FloMediaPlayerControlBaseDirective, coerceInputToBoolean } from '../mp-base.directive'
import { VIDEO_PLAYER_CONTROLS_PLAY_FUNC, PlayControlFunction } from './mp-play.tokens'

// tslint:disable: no-if-statement
// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword

@Directive({
  selector: '[floMp][floMpClickToPlay]',
})
export class FloMediaPlayerPlayControlDirective<TMeta = any> extends FloMediaPlayerControlBaseDirective<TMeta> {
  constructor(private elmRef: ElementRef<HTMLElement>, private cd: ChangeDetectorRef,
    @Inject(VIDEO_PLAYER_CONTROLS_PLAY_FUNC) private func: PlayControlFunction) {
    super()
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

    this.mediaElementRef.tapSome(ve => this.func(ve, this.elmRef, this.floMpMeta))
  }
}
