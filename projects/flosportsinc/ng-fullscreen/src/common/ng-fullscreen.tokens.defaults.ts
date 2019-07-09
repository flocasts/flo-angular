import {
  FullscreenRequestEvents, FullscreenExitEvents, FullscreenChangeEvents,
  FullscreenErrorEvents, FullscreenEnabledKeys, FullscreenElementKeys, FullscreenEnabledFunc
} from './ng-fullscreen.tokens'
import { fromEvent } from 'rxjs'
import { map, filter } from 'rxjs/operators'

export const DEFAULT_FS_FULLSCREEN_REQUEST_EVENTS: ReadonlyArray<FullscreenRequestEvents> = [
  'requestFullscreen',
  'webkitRequestFullscreen',
  'webkitRequestFullScreen',
  'mozRequestFullScreen',
  'msRequestFullscreen',
  'webkitEnterFullscreen'
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
    return fromEvent(elm, 'loadedmetadata').pipe(
      map(evt => !evt.target ? false : (evt.target as any).webkitSupportsFullscreen)
    )
  }
  return lambda
}
