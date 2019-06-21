import { Directive, Input, HostListener, ElementRef, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core'
import { VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, PauseControlFunction } from './vpc-pause.tokens'
import { FloMediaPlayerControlDirectiveBase, coerceInputToBoolean } from '../vpc-base.directive'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floVpc][floVpcPause]'
})
export class FloMediaPlayerPauseControlDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    @Inject(VIDEO_PLAYER_CONTROLS_PAUSE_FUNC) private func: PauseControlFunction,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _play?: string | boolean

  @Input()
  get floVpcPause() {
    return this._play
  }
  set floVpcPause(val: any) {
    this._play = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floVpcPause) { return }

    this.maybeMediaElement().tapSome(ve => this.func(ve, this.elmRef, this.floVpcMeta))
  }
}
