import { ElementRef, InjectionToken } from '@angular/core'

export type PlayControlFunction<TMeta = any> = (videoRef: HTMLMediaElement, elmRef: ElementRef<HTMLElement>, meta?: TMeta) => void
export const VIDEO_PLAYER_CONTROLS_PLAY_FUNC = new InjectionToken('fs.vp.ctrl.play')

export function defaultPlayFactoryFunction(): PlayControlFunction {
  const lambda = (mediaRef: HTMLMediaElement, _elmRef: ElementRef<HTMLElement>, _meta: any) => {
    mediaRef.play()
  }
  return lambda
}
