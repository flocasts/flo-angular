import { Directive, Input, HostListener, ElementRef, Inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core'
import { VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, PauseControlFunction } from './mpc-pause.tokens'
import { FloMediaPlayerControlDirectiveBase, coerceInputToBoolean } from '../mpc-base.directive'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floMp][floMpClickToPause]'
})
export class FloMediaPlayerPauseControlDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    @Inject(VIDEO_PLAYER_CONTROLS_PAUSE_FUNC) private func: PauseControlFunction,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
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

    this.maybeMediaElement().tapSome(ve => this.func(ve, this.elmRef, this.floMpcMeta))
  }
}
