import { Directive, Input, HostListener, ElementRef, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core'
import { VIDEO_PLAYER_CONTROLS_PAUSE_FUNC, PauseControlFunction } from './vpc-pause.tokens'
import { FloVideoPlayerControlDirectiveBase, coerceInputToBoolean } from '../vpc-base.directive'

// tslint:disable: no-if-statement

@Directive({
  selector: '[floVpc][floVpcPause]'
})
export class FloVideoPlayerPauseControlDirective<TMeta = any> extends FloVideoPlayerControlDirectiveBase<TMeta> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    @Inject(VIDEO_PLAYER_CONTROLS_PAUSE_FUNC) private func: PauseControlFunction,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  // tslint:disable-next-line: readonly-keyword
  private _play?: string | boolean

  @Input()
  get floVpcPause() {
    return this._play
  }
  set floVpcPause(val: any) {
    // tslint:disable-next-line: no-object-mutation
    this._play = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floVpcPause) { return }

    this.maybeVideoElement().tapSome(ve => this.func(ve, this.elmRef, this.floVpcMeta))
  }
}
