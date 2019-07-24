import { ElementRef, InjectionToken } from '@angular/core'

export type UnmuteControlFunction<TMeta = any> = (mediaRef: HTMLMediaElement, elmRef: ElementRef<HTMLElement>, meta?: TMeta) => void
export const MEDIA_PLAYER_CONTROLS_UNMUTE_FUNC = new InjectionToken('fs.mp.ctrl.unmute')

export function defaultUnmuteFactoryFunction(): UnmuteControlFunction {
  const lambda = (mediaRef: HTMLMediaElement, _elmRef: ElementRef<HTMLElement>, _meta: any) => {
    // tslint:disable: no-object-mutation
    mediaRef.muted = false
    // tslint:disable-next-line: no-if-statement
    if (mediaRef.volume === 0) {
      mediaRef.volume = 1
    }
  }
  return lambda
}
