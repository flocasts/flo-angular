import { Directive, Inject, ChangeDetectorRef, PLATFORM_ID, Input, HostListener } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase } from '../mpc-base.directive'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floMp][floMpClickToSkipBack]'
})
export class FloMediaPlayerControlSkipBackDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private cd: ChangeDetectorRef, @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _floMpClickToSkipBack: number

  @Input()
  get floMpClickToSkipBack() {
    return this._floMpClickToSkipBack
  }
  set floMpClickToSkipBack(val: number) {
    if (val && typeof val === 'number') {
      this._floMpClickToSkipBack = val / 1000
    } else {
      this._floMpClickToSkipBack = 0
    }
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floMpClickToSkipBack) { return }

    this.maybeMediaElement()
      .filter(a => a instanceof HTMLVideoElement)
      .tapSome((ve: HTMLVideoElement) => {
        ve.currentTime = ve.currentTime - this.floMpClickToSkipBack
      })
  }
}

@Directive({
  selector: '[floMp][floMpClickToSkipForward]'
})
export class FloMediaPlayerControlSkipForwardDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private cd: ChangeDetectorRef, @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _floMpClickToSkipForward: number

  @Input()
  get floMpClickToSkipForward() {
    return this._floMpClickToSkipForward
  }
  set floMpClickToSkipForward(val: number) {
    if (val && typeof val === 'number') {
      this._floMpClickToSkipForward = val / 1000
    } else {
      this._floMpClickToSkipForward = 0
    }
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floMpClickToSkipForward) { return }

    this.maybeMediaElement()
      .filter(a => a instanceof HTMLVideoElement)
      .tapSome((ve: HTMLVideoElement) => {
        ve.currentTime = ve.currentTime + this.floMpClickToSkipForward
      })
  }
}
