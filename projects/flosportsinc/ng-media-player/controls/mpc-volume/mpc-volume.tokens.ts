import { ElementRef, InjectionToken } from '@angular/core'

export type VolumeControlFunction<TMeta = any> = (mediaRef: HTMLMediaElement, elmRef: ElementRef<HTMLElement>, meta?: TMeta) => void
export const VIDEO_PLAYER_CONTROLS_VOLUME_FUNC = new InjectionToken('fs.vp.ctrl.vol')

export function defaultPauseFactoryFunction(): VolumeControlFunction {
  const lambda = (mediaRef: HTMLMediaElement, _elmRef: ElementRef<HTMLElement>, _meta: any) => {
    mediaRef.pause()
  }
  return lambda
}
