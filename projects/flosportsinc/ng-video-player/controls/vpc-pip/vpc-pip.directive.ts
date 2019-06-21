import { Directive, Input, HostListener, ElementRef, Inject, PLATFORM_ID } from '@angular/core'
import { VIDEO_PLAYER_CONTROLS_PIP_FUNC, PipControlFunction } from './vpc-pip.tokens'
import { FloVideoPlayerControlDirectiveBase, coerceInputToBoolean } from '../vpc-base.directive'
import { DOCUMENT } from '@angular/common'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

export enum SAFARI_PIP_STATES {
  PIP = 'picture-in-picture',
  INLINE = 'inline'
}

@Directive({
  selector: '[floVpc][floVpcPip]'
})
export class FloVideoPlayerControlPipDirective<TMeta = any> extends FloVideoPlayerControlDirectiveBase<TMeta> {
  constructor(private elmRef: ElementRef<HTMLElement>,
    @Inject(VIDEO_PLAYER_CONTROLS_PIP_FUNC) private func: PipControlFunction,
    @Inject(PLATFORM_ID) protected platformId: string,
    @Inject(DOCUMENT) private doc: any) {
    super(platformId)
  }

  private _pip?: string | boolean

  @Input()
  get floVpcPip() {
    return this._pip
  }
  set floVpcPip(val: any) {
    this._pip = coerceInputToBoolean(val)
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
    if (!this.floVpcPip) { return }
    this.maybeVideoElement().tapSome(ve => {
      this.enterPip(ve)
    })
  }
}
