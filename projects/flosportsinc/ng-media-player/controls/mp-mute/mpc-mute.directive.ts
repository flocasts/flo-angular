import { Directive, Input, HostListener, Inject, ChangeDetectorRef, PLATFORM_ID, ElementRef } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase, coerceInputToBoolean } from '../mp-base.directive'
import { MEDIA_PLAYER_CONTROLS_MUTE_FUNC, MuteControlFunction } from './mpc-mute.tokens'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floMp][floMpClickToMute]'
})
export class FloMediaPlayerMuteControlDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private cd: ChangeDetectorRef, private elmRef: ElementRef<HTMLElement>,
    @Inject(MEDIA_PLAYER_CONTROLS_MUTE_FUNC) private func: MuteControlFunction,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _floMpClickToMute?: string | boolean

  @Input()
  get floMpClickToMute() {
    return this._floMpClickToMute
  }
  set floMpClickToMute(val: any) {
    this._floMpClickToMute = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floMpClickToMute) { return }

    this.maybeMediaElement().tapSome(ve => {
      this.func(ve, this.elmRef, this.floMpMeta)
    })
  }
}
