export const DEFAULT_FS_FULLSCREEN_REQUEST_EVENTS: ReadonlyArray<string> = [
  'requestFullscreen',
  'webkitRequestFullscreen',
  'webkitRequestFullScreen',
  'mozRequestFullScreen',
  'msRequestFullscreen'
]

export const DEFAULT_FS_FULLSCREEN_EXIT_EVENTS: ReadonlyArray<string> = [
  'exitFullscreen',
  'webkitExitFullscreen',
  'webkitCancelFullScreen',
  'mozCancelFullScreen',
  'msExitFullscreen'
]

export const DEFAULT_FS_FULLSCREEN_ELEMENT_ERROR_EVENTS: ReadonlyArray<string> = [
  'fullscreenerror',
  'webkitfullscreenerror',
  'webkitfullscreenerror',
  'mozfullscreenerror',
  'MSFullscreenError'
]

export const DEFAULT_FS_FULLSCREEN_ELEMENT: ReadonlyArray<string> = [
  'fullscreenElement',
  'webkitFullscreenElement',
  'webkitCurrentFullScreenElement',
  'mozFullScreenElement',
  'msFullscreenElement'
]

export const DEFAULT_FS_FULLSCREEN_ENABLED: ReadonlyArray<string> = [
  'fullscreenEnabled',
  'mozFullscreenEnabled',
  'webkitFullscreenEnabled',
  'msFullscreenEnabled'
]

export const DEFAULT_FS_FULLSCREEN_CHANGE_EVENTS: ReadonlyArray<string> = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange'
]
