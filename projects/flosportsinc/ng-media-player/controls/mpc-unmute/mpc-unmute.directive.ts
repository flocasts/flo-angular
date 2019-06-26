import { Directive, Input, HostListener, Inject, ChangeDetectorRef, PLATFORM_ID, ElementRef } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase, coerceInputToBoolean } from '../mpc-base.directive'
import { MEDIA_PLAYER_CONTROLS_UNMUTE_FUNC, UnmuteControlFunction } from './mpc-unmute.tokens'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floMpc][floMpcUnmute]'
})
export class FloMediaPlayerUnmuteControlDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private cd: ChangeDetectorRef, private elmRef: ElementRef<HTMLElement>,
    @Inject(MEDIA_PLAYER_CONTROLS_UNMUTE_FUNC) private func: UnmuteControlFunction,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _floMpcUnmute?: string | boolean

  @Input()
  get floMpcUnmute() {
    return this._floMpcUnmute
  }
  set floMpcUnmute(val: any) {
    this._floMpcUnmute = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floMpcUnmute) { return }

    this.maybeMediaElement().tapSome(ve => {
      this.func(ve, this.elmRef, this.floMpcMeta)
    })
  }
}
