import { Directive, Input, HostListener, ElementRef, Inject, ChangeDetectorRef } from '@angular/core'
import { VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, PauseControlFunction } from './mp-pause.tokens'
import { FloMediaPlayerControlBaseDirective, coerceInputToBoolean } from '../mp-base.directive'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floMp][floMpClickToPause]'
})
export class FloMediaPlayerPauseControlDirective<TMeta = any> extends FloMediaPlayerControlBaseDirective<TMeta> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    @Inject(VIDEO_PLAYER_CONTROLS_PAUSE_FUNC) private func: PauseControlFunction) {
    super()
  }

  private _floMpClickToPause?: string | boolean

  @Input()
  get floMpClickToPause() {
    return this._floMpClickToPause
  }
  set floMpClickToPause(val: any) {
    this._floMpClickToPause = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floMpClickToPause) { return }

    this.mediaElementRef.tapSome(ve => this.func(ve, this.elmRef, this.floMpMeta))
  }
}
