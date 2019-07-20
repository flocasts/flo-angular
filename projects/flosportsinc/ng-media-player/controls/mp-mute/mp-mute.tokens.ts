import { ElementRef, InjectionToken } from '@angular/core'

export type MuteControlFunction<TMeta = any> = (mediaRef: HTMLMediaElement, elmRef: ElementRef<HTMLElement>, meta?: TMeta) => void
export const MEDIA_PLAYER_CONTROLS_MUTE_FUNC = new InjectionToken('fs.mp.ctrl.mute')

export function defaultMuteFactoryFunction(): MuteControlFunction {
  const lambda = (mediaRef: HTMLMediaElement, _elmRef: ElementRef<HTMLElement>, _meta: any) => {
    // tslint:disable-next-line: no-object-mutation
    mediaRef.muted = true
  }
  return lambda
}
