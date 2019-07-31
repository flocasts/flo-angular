import { Directive, Input, HostListener, ChangeDetectorRef } from '@angular/core'
import { FloMediaPlayerControlBaseDirective, coerceInputToBoolean } from '../mp-base.directive'
import { FloPictureInPictureNativeService } from './mp-pip-native.service'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floMp][floMpClickToEnterNativePip]'
})
export class FloMediaPlayerControlPipNativeEnterDirective<TMeta = any> extends FloMediaPlayerControlBaseDirective<TMeta> {
  constructor(private ps: FloPictureInPictureNativeService, private cd: ChangeDetectorRef) {
    super()
  }

  private _floMpClickToEnterNativePip?: string | boolean

  @Input()
  get floMpClickToEnterNativePip() {
    return this._floMpClickToEnterNativePip
  }
  set floMpClickToEnterNativePip(val: any) {
    this._floMpClickToEnterNativePip = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floMpClickToEnterNativePip) { return }

    this.mediaElementRef
      .filter(a => a instanceof HTMLVideoElement)
      .tapSome((ve: HTMLVideoElement) => {
        this.ps.enterPip(ve)
      })
  }
}

@Directive({
  selector: '[floMp][floMpClickToExitNativePip]'
})
export class FloMediaPlayerControlPipNativeExitDirective<TMeta = any> extends FloMediaPlayerControlBaseDirective<TMeta> {
  private _floMpClickToExitNativePip?: string | boolean

  constructor(private ps: FloPictureInPictureNativeService, private cd: ChangeDetectorRef) {
    super()
  }

  @Input()
  get floMpClickToExitNativePip() {
    return this._floMpClickToExitNativePip
  }
  set floMpClickToExitNativePip(val: any) {
    this._floMpClickToExitNativePip = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    this.cd.detectChanges()

    if (!this.floMpClickToExitNativePip) { return }

    this.mediaElementRef
      .filter(a => a instanceof HTMLVideoElement)
      .tapSome((ve: HTMLVideoElement) => {
        this.ps.exitPip(ve)
      })
  }
}
