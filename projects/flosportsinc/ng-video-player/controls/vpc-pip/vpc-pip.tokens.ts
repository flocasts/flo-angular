import { ElementRef, InjectionToken } from '@angular/core'

export type PipControlFunction<TMeta = any> = (videoRef: HTMLVideoElement, elmRef: ElementRef<HTMLElement>, meta?: TMeta) => void
export const VIDEO_PLAYER_CONTROLS_PIP_FUNC = new InjectionToken('fs.vp.ctrl.pip')

export function defaultPipFactoryFunction(): PipControlFunction {
  const lambda = (videoRef: HTMLVideoElement, _elmRef: ElementRef<HTMLElement>, _meta: any) => {
    videoRef.pause()
  }
  return lambda
}
