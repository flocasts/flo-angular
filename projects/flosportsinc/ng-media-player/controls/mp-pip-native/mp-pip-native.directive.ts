import { Directive, Input, HostListener, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase, coerceInputToBoolean } from '../mp-base.directive'
import { FloPictureInPictureNativeService } from './mp-pip-native.service'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floMp][floMpClickToEnterNativePip]'
})
export class FloMediaPlayerControlPipNativeEnterDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private ps: FloPictureInPictureNativeService, private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
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

    this.maybeMediaElement()
      .filter(a => a instanceof HTMLVideoElement)
      .tapSome((ve: HTMLVideoElement) => {
        this.ps.enterPip(ve)
      })
  }
}

@Directive({
  selector: '[floMp][floMpClickToExitNativePip]'
})
export class FloMediaPlayerControlPipNativeExitDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  private _floMpClickToExitNativePip?: string | boolean

  constructor(private ps: FloPictureInPictureNativeService, private cd: ChangeDetectorRef, @Inject(PLATFORM_ID) platformId: string) {
    super(platformId)
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

    this.maybeMediaElement()
      .filter(a => a instanceof HTMLVideoElement)
      .tapSome((ve: HTMLVideoElement) => {
        this.ps.exitPip(ve)
      })
  }
}
