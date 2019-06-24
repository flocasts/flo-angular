import { Directive, Input, HostListener, Inject, PLATFORM_ID } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase, coerceInputToBoolean } from '../mpc-base.directive'
import { DOCUMENT } from '@angular/common'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

export enum SAFARI_PIP_STATES {
  PIP = 'picture-in-picture',
  INLINE = 'inline'
}

@Directive({
  selector: '[floMpc][floMpcPipNativeEnter]'
})
export class FloMediaPlayerControlPipNativeEnterDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(@Inject(PLATFORM_ID) protected platformId: string,
    @Inject(DOCUMENT) private doc: any) {
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

  readonly useChromeVariant = () => 'pictureInPictureEnabled' in this.doc
  readonly useSafariVariant = (video: any) => video.webkitSupportsPresentationMode && typeof video.webkitSetPresentationMode === 'function'

  readonly enterPip = (video: any) => {
    if (this.useChromeVariant()) {
      video.requestPictureInPicture()
    } else if (this.useSafariVariant(video)) {
      video.webkitSetPresentationMode(SAFARI_PIP_STATES.PIP)
    }
  }

  readonly isInPip = (video: any) => {
    if (this.useChromeVariant()) {
      return this.doc.pictureInPictureElement === video
    } else if (this.useSafariVariant(video)) {
      return video.webkitPresentationMode === SAFARI_PIP_STATES.PIP
    }
  }

  @HostListener('click')
  click() {
    if (!this.floMpcPipNativeEnter) { return }
    this.maybeMediaElement().tapSome(ve => {
      this.enterPip(ve)
    })
  }
}

@Directive({
  selector: '[floMpc][floMpcPipNativeExit]'
})
export class FloMediaPlayerControlPipNativeExitDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  private _floMpcPipNativeExit?: string | boolean

  @Input()
  get floMpcPipNativeExit() {
    return this._floMpcPipNativeExit
  }
  set floMpcPipNativeExit(val: any) {
    this._floMpcPipNativeExit = coerceInputToBoolean(val)
  }
}
