import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { DOCUMENT, isPlatformServer } from '@angular/common'

export interface IFloPictureInPictureService {
  readonly platformSupportsPip: () => boolean
  readonly enterPip: (media: HTMLMediaElement) => void
  readonly exitPip: (media: HTMLMediaElement) => void
  readonly getPipElement: (media: HTMLMediaElement) => HTMLElement
  readonly isPipActive: () => boolean
}

@Injectable({ providedIn: 'root' })
export class FloPictureInPictureService implements IFloPictureInPictureService {
  constructor(
    @Inject(DOCUMENT) private doc: any,
    @Inject(PLATFORM_ID) private platformId: string
  ) { }

  readonly platformSupportsPip: () => false
  readonly enterPip: () => void
  readonly exitPip: () => void
  readonly isPipActive: () => false
  readonly getPipElement: () => HTMLElement
}
