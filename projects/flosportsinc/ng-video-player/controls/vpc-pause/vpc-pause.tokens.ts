import { ElementRef, InjectionToken } from '@angular/core'

export type PauseControlFunction<TMeta = any> = (videoRef: HTMLVideoElement, elmRef: ElementRef<HTMLElement>, meta?: TMeta) => void
export const VIDEO_PLAYER_CONTROLS_PAUSE_FUNC = new InjectionToken('fs.vp.ctrl.pause')

export function defaultPauseFactoryFunction(): PauseControlFunction {
  const lambda = (videoRef: HTMLVideoElement, _elmRef: ElementRef<HTMLElement>, _meta: any) => {
    videoRef.pause()
  }
  return lambda
}
