import { Directive, Input, HostListener, Inject, ChangeDetectorRef, ElementRef } from '@angular/core'
import { FloMediaPlayerControlBaseDirective, coerceInputToBoolean } from '../mp-base.directive'
import { MEDIA_PLAYER_CONTROLS_MUTE_FUNC, MuteControlFunction } from './mp-mute.tokens'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floMp][floMpClickToMute]'
})
export class FloMediaPlayerMuteControlDirective<TMeta = any> extends FloMediaPlayerControlBaseDirective<TMeta> {
  constructor(private cd: ChangeDetectorRef, private elmRef: ElementRef<HTMLElement>,
    @Inject(MEDIA_PLAYER_CONTROLS_MUTE_FUNC) private func: MuteControlFunction) {
    super()
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

    this.mediaElementRef.tapSome(ve => {
      this.func(ve, this.elmRef, this.floMpMeta)
    })
  }
}
