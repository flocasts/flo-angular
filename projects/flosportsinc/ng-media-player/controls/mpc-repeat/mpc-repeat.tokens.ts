import { ElementRef, InjectionToken } from '@angular/core'

export type RepeatControlFunction<TMeta = any> = (mediaRef: HTMLMediaElement, elmRef: ElementRef<HTMLElement>, meta?: TMeta) => void

export const MEDIA_PLAYER_CONTROLS_ENABLE_REPEAT_FUNC = new InjectionToken('fs.mp.ctrl.repeat.on')
export const MEDIA_PLAYER_CONTROLS_DISABLE_REPEAT_FUNC = new InjectionToken('fs.mp.ctrl.repeat.off')

export function defaultEnableRepeatFunction(): RepeatControlFunction {
  const lambda = (mediaRef: HTMLMediaElement, _elmRef: ElementRef<HTMLElement>, _meta: any) => {
    // tslint:disable-next-line: no-object-mutation
    mediaRef.loop = true
  }
  return lambda
}

export function defaultDisableRepeatFunction(): RepeatControlFunction {
  const lambda = (mediaRef: HTMLMediaElement, _elmRef: ElementRef<HTMLElement>, _meta: any) => {
    // tslint:disable-next-line: no-object-mutation
    mediaRef.loop = false
  }
  return lambda
}
