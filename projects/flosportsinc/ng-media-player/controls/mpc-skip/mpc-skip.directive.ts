import { Directive, Inject, ChangeDetectorRef, PLATFORM_ID, Input, HostListener } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase } from '../mpc-base.directive'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floMpc][floMpcSkipBack]'
})
export class FloMediaPlayerControlSkipBackDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private cd: ChangeDetectorRef, @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _floMpcSkipBack: number

  @Input()
  get floMpcSkipBack() {
    return this._floMpcSkipBack
  }
  set floMpcSkipBack(val: number) {
    if (val && typeof val === 'number') {
      this._floMpcSkipBack = val / 1000
    } else {
      this._floMpcSkipBack = 0
    }
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floMpcSkipBack) { return }

    this.maybeMediaElement()
      .filter(a => a instanceof HTMLVideoElement)
      .tapSome((ve: HTMLVideoElement) => {
        ve.currentTime = ve.currentTime - this.floMpcSkipBack
      })
  }
}

@Directive({
  selector: '[floMpc][floMpcSkipForward]'
})
export class FloMediaPlayerControlSkipForwardDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private cd: ChangeDetectorRef, @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _floMpcSkipForward: number

  @Input()
  get floMpcSkipForward() {
    return this._floMpcSkipForward
  }
  set floMpcSkipForward(val: number) {
    if (val && typeof val === 'number') {
      this._floMpcSkipForward = val / 1000
    } else {
      this._floMpcSkipForward = 0
    }
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floMpcSkipForward) { return }

    this.maybeMediaElement()
      .filter(a => a instanceof HTMLVideoElement)
      .tapSome((ve: HTMLVideoElement) => {
        // ve.rate
        ve.currentTime = ve.currentTime + this.floMpcSkipForward
      })
  }
}
