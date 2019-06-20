import { Directive, Input, HostListener, ElementRef, Inject, PLATFORM_ID } from '@angular/core'
import { VIDEO_PLAYER_CONTROLS_PIP_FUNC, PipControlFunction } from './vpc-pip.tokens'
import { FloVideoPlayerControlDirectiveBase, coerceInputToBoolean } from '../vpc-base.directive'

@Directive({
  selector: '[floVpc][floVpcPip]'
})
export class FloVideoPlayerControlPipDirective<TMeta = any> extends FloVideoPlayerControlDirectiveBase<TMeta> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    @Inject(VIDEO_PLAYER_CONTROLS_PIP_FUNC) private func: PipControlFunction,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  // tslint:disable-next-line: readonly-keyword
  private _pip?: string | boolean

  @Input()
  get floVpcPip() {
    return this._pip
  }
  set floVpcPip(val: any) {
    // tslint:disable-next-line: no-object-mutation
    this._pip = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    // tslint:disable-next-line: no-if-statement
    if (!this.floVpcPip) { return }

    // this.maybeVideoElement().tapSome(ve => this.func(ve, this.elmRef, this.floVpcMeta))
  }
}
