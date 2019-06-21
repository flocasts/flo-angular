import { ElementRef, InjectionToken } from '@angular/core'

export type PipControlFunction<TMeta = any> = (videoRef: HTMLMediaElement, elmRef: ElementRef<HTMLElement>, meta?: TMeta) => void
export const MEDIA_PLAYER_CONTROLS_PIP_FUNC = new InjectionToken('fs.vp.ctrl.pip')

export function defaultPipFactoryFunction(): PipControlFunction {
  const lambda = (videoRef: HTMLMediaElement, _elmRef: ElementRef<HTMLElement>, _meta: any) => {
    videoRef.pause()
  }
  return lambda
}
