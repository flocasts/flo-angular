import { ElementRef, InjectionToken } from '@angular/core'

export type Te<TMeta = any> = (videoRef: HTMLVideoElement, elmRef: ElementRef<HTMLElement>, meta?: TMeta) => void
export const VIDEO_PLAYER_CONTROLS_PLAY_FUNC = new InjectionToken('fs.vp.ctrl.play')

export function defaultPlayFactoryFunction(): Te {
  const lambda = (videoRef: HTMLVideoElement, _elmRef: ElementRef<HTMLElement>) => {
    videoRef.play()
  }
  return lambda
}
