import { ElementRef, InjectionToken } from '@angular/core'

export type PauseControlFunction<TMeta = any> = (videoRef: HTMLMediaElement, elmRef: ElementRef<HTMLElement>, meta?: TMeta) => void
export const VIDEO_PLAYER_CONTROLS_PAUSE_FUNC = new InjectionToken('fs.vp.ctrl.pause')

export function defaultPauseFactoryFunction(): PauseControlFunction {
  const lambda = (mediaRef: HTMLMediaElement, _elmRef: ElementRef<HTMLElement>, _meta: any) => {
    mediaRef.pause()
  }
  return lambda
}
