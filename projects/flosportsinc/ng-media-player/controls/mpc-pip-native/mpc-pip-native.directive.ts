import { Directive, Input, HostListener, Inject, PLATFORM_ID } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase, coerceInputToBoolean } from '../mpc-base.directive'
import { FloPictureInPictureNativeService } from './mpc-pip-native.service'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floMpc][floMpcPipNativeEnter]'
})
export class FloMediaPlayerControlPipNativeEnterDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private ps: FloPictureInPictureNativeService, @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _floMpcPipNativeEnter?: string | boolean

  @Input()
  get floMpcPipNativeEnter() {
    return this._floMpcPipNativeEnter
  }
  set floMpcPipNativeEnter(val: any) {
    this._floMpcPipNativeEnter = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    if (!this.floMpcPipNativeEnter) { return }
    this.maybeMediaElement()
      .filter(a => a instanceof HTMLVideoElement)
      .tapSome((ve: HTMLVideoElement) => {
        this.ps.enterPip(ve)
      })
  }
}

@Directive({
  selector: '[floMpc][floMpcPipNativeExit]'
})
export class FloMediaPlayerControlPipNativeExitDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  private _floMpcPipNativeExit?: string | boolean

  constructor(private ps: FloPictureInPictureNativeService, @Inject(PLATFORM_ID) platformId: string) {
    super(platformId)
  }

  @Input()
  get floMpcPipNativeExit() {
    return this._floMpcPipNativeExit
  }
  set floMpcPipNativeExit(val: any) {
    this._floMpcPipNativeExit = coerceInputToBoolean(val)
  }

  @HostListener('click')
  click() {
    if (!this.floMpcPipNativeExit) { return }
    this.maybeMediaElement()
      .filter(a => a instanceof HTMLVideoElement)
      .tapSome((ve: HTMLVideoElement) => {
        this.ps.exitPip(ve)
      })
  }
}
