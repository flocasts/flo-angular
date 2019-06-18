import {
  FullscreenRequestEvents, FullscreenExitEvents, FullscreenChangeEvents,
  FullscreenErrorEvents, FullscreenEnabledKeys, FullscreenElementKeys
} from './ng-fullscreen.tokens'

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
