import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { DOCUMENT, isPlatformServer } from '@angular/common'

// tslint:disable: no-if-statement

export interface IFloPictureInPictureNativeService {
  readonly platformSupportsPip: (mediaElement: HTMLMediaElement | SafariPipStandardHTMLMediaElement) => boolean
  readonly enterPip: (video: HTMLVideoElement) => void
  readonly exitPip: (video: HTMLVideoElement) => void
  readonly getPipElement: (video: HTMLVideoElement) => HTMLMediaElement | undefined
  readonly isPipActive: () => boolean
}

export enum SAFARI_PIP_STATES {
  PIP = 'picture-in-picture',
  INLINE = 'inline'
}

export type WebPipStandardHTMLMediaElement = HTMLMediaElement & {
  readonly disablePictureInPicture: boolean
  readonly requestPictureInPicture: () => Promise<any>
}
export type WebPipStandardHTMLDocument = HTMLDocument & {
  readonly pictureInPictureEnabled: boolean
  readonly exitPictureInPicture: () => Promise<any>
}
export type SafariPipStandardHTMLMediaElement = HTMLMediaElement & {
  readonly webkitSupportsPresentationMode: boolean
  readonly webkitSetPresentationMode: (val: SAFARI_PIP_STATES) => void
}

@Injectable({ providedIn: 'root' })
export class FloPictureInPictureNativeService implements IFloPictureInPictureNativeService {
  constructor(
    @Inject(DOCUMENT) private doc: any,
    @Inject(PLATFORM_ID) private platformId: string
  ) { }

  // https://wicg.github.io/picture-in-picture
  private readonly useWebStandardVariant = (media?: WebPipStandardHTMLMediaElement) => {
    const docSupport = 'pictureInPictureEnabled' in this.doc

    return media
      ? docSupport && !media.disablePictureInPicture
      : docSupport
  }

  // tslint:disable-next-line: max-line-length
  // https://developer.apple.com/library/archive/releasenotes/General/WhatsNewInSafari/Articles/Safari_9_0.html#//apple_ref/doc/uid/TP40014305-CH9-SW18
  private readonly useSafariStandardVariant = (media: SafariPipStandardHTMLMediaElement) =>
    media.webkitSupportsPresentationMode && typeof media.webkitSetPresentationMode === 'function'


  readonly enterPip = (media: HTMLMediaElement) => {
    if (this.useWebStandardVariant(media as WebPipStandardHTMLMediaElement)) {
      (media as WebPipStandardHTMLMediaElement).requestPictureInPicture().catch(console.error)
    } else if (this.useSafariStandardVariant(media as SafariPipStandardHTMLMediaElement)) {
      (media as SafariPipStandardHTMLMediaElement).webkitSetPresentationMode(SAFARI_PIP_STATES.PIP)
    }
  }

  readonly exitPip = (media: HTMLMediaElement) => {
    if (this.useWebStandardVariant(media as WebPipStandardHTMLMediaElement)) {
      (this.doc as WebPipStandardHTMLDocument).exitPictureInPicture().catch(console.log)
    } else if (this.useSafariStandardVariant(media as SafariPipStandardHTMLMediaElement)) {
      (media as SafariPipStandardHTMLMediaElement).webkitSetPresentationMode(SAFARI_PIP_STATES.INLINE)
    }
  }

  readonly getPipElement = (): HTMLMediaElement | undefined => this.useWebStandardVariant()
    ? this.doc.pictureInPictureElement
    : Array.from((this.doc as HTMLDocument).querySelectorAll('video'))
      .filter(video => (video as any).webkitPresentationMode === SAFARI_PIP_STATES.PIP)
      .reverse()
      .pop()

  readonly platformSupportsPip =
    (mediaElement: HTMLMediaElement) =>
      this.useWebStandardVariant() || this.useSafariStandardVariant(mediaElement as SafariPipStandardHTMLMediaElement)

  readonly isPipActive = () => this.getPipElement() !== undefined
  readonly canEnterPip = () => false
}
