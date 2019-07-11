import {
  FullscreenRequestEvents, FullscreenExitEvents, FullscreenChangeEvents,
  FullscreenErrorEvents, FullscreenEnabledKeys, FullscreenElementKeys, FullscreenEnabledFunc
} from './ng-fullscreen.tokens'
import { fromEvent, of } from 'rxjs'
import { map, take } from 'rxjs/operators'

export const DEFAULT_FS_FULLSCREEN_REQUEST_EVENTS: ReadonlyArray<FullscreenRequestEvents> = [
  'requestFullscreen',
  'webkitRequestFullscreen',
  'webkitRequestFullScreen',
  'mozRequestFullScreen',
  'msRequestFullscreen'
]

export const DEFAULT_FS_FULLSCREEN_EXIT_EVENTS: ReadonlyArray<FullscreenExitEvents> = [
  'exitFullscreen',
  'webkitExitFullscreen',
  'webkitCancelFullScreen',
  'mozCancelFullScreen',
  'msExitFullscreen'
]

export const DEFAULT_FS_FULLSCREEN_ELEMENT_ERROR_EVENTS: ReadonlyArray<FullscreenErrorEvents> = [
  'fullscreenerror',
  'webkitfullscreenerror',
  'webkitfullscreenerror',
  'mozfullscreenerror',
  'MSFullscreenError'
]

export const DEFAULT_FS_FULLSCREEN_ELEMENT: ReadonlyArray<FullscreenElementKeys> = [
  'fullscreenElement',
  'webkitFullscreenElement',
  'webkitCurrentFullScreenElement',
  'mozFullScreenElement',
  'msFullscreenElement'
]

export const DEFAULT_FS_FULLSCREEN_ENABLED: ReadonlyArray<FullscreenEnabledKeys> = [
  'fullscreenEnabled',
  'mozFullscreenEnabled',
  'webkitFullscreenEnabled',
  'msFullscreenEnabled'
]

export const DEFAULT_FS_FULLSCREEN_CHANGE_EVENTS: ReadonlyArray<FullscreenChangeEvents> = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange'
]

export function DEFAULT_FS_FULLSCREEN_ENABLED_FUNC(): FullscreenEnabledFunc {
  const lambda = (elm: HTMLElement) => {
    const _elm = elm instanceof HTMLVideoElement ? elm : elm.querySelector('video')
    return !_elm ? of(false) : (_elm as any).readyState >= 2
        ? of(true)
        : fromEvent(_elm, 'loadedmetadata').pipe(
          map(evt => !evt.target ? false : (evt.target as any).webkitSupportsFullscreen),
          take(1))
  }
  return lambda
}

export const DEFAULT_FS_FULLSCREEN_IOS_POLL_ENABLED = true
export const DEFAULT_FS_FULLSCREEN_IOS_POLL_MS = 1000
