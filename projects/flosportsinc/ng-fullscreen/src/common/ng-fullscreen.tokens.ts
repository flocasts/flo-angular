import { InjectionToken } from '@angular/core'
import { Observable } from 'rxjs'

// tslint:disable: max-line-length
export type FullscreenRequestEvents = 'requestFullscreen' | 'webkitRequestFullscreen' | 'webkitRequestFullScreen' | 'mozRequestFullScreen' | 'msRequestFullscreen' | 'webkitEnterFullscreen'
export type FullscreenExitEvents = 'exitFullscreen' | 'webkitExitFullscreen' | 'webkitCancelFullScreen' | 'mozCancelFullScreen' | 'msExitFullscreen'
export type FullscreenChangeEvents = 'fullscreenchange' | 'webkitfullscreenchange' | 'mozfullscreenchange' | 'MSFullscreenChange'
export type FullscreenErrorEvents = 'fullscreenerror' | 'webkitfullscreenerror' | 'webkitfullscreenerror' | 'mozfullscreenerror' | 'MSFullscreenError'
export type FullscreenElementKeys = 'fullscreenElement' | 'webkitFullscreenElement' | 'webkitCurrentFullScreenElement' | 'mozFullScreenElement' | 'msFullscreenElement'
export type FullscreenEnabledKeys = 'fullscreenEnabled' | 'mozFullscreenEnabled' | 'webkitFullscreenEnabled' | 'msFullscreenEnabled'

export type FullscreenEnabledFunc = (elm: HTMLElement) => Observable<boolean>

export const FS_FULLSCREEN_REQUEST_EVENTS = new InjectionToken<ReadonlyArray<FullscreenRequestEvents>>('fs.fullscreen.request')
export const FS_FULLSCREEN_EXIT_EVENTS = new InjectionToken<ReadonlyArray<FullscreenExitEvents>>('fs.fullscreen.exit')
export const FS_FULLSCREEN_CHANGE_EVENTS = new InjectionToken<ReadonlyArray<FullscreenChangeEvents>>('fs.fullscreen.change')
export const FS_FULLSCREEN_ELEMENT_ERROR_EVENTS = new InjectionToken<ReadonlyArray<FullscreenErrorEvents>>('fs.fullscreen.error')
export const FS_FULLSCREEN_ELEMENT = new InjectionToken<ReadonlyArray<FullscreenElementKeys>>('fs.fullscreen.element')
export const FS_FULLSCREEN_ENABLED = new InjectionToken<ReadonlyArray<FullscreenEnabledKeys>>('fs.fullscreen.enabled')
export const FS_FULLSCREEN_ENABLED_FUNC = new InjectionToken<FullscreenEnabledFunc>('fs.fullscreen.enabled-func')
export const FS_FULLSCREEN_IOS_POLL_ENABLED = new InjectionToken<boolean>('fs.fullscreen.ios.poll.enabled')
export const FS_FULLSCREEN_IOS_POLL_MS = new InjectionToken<number>('fs.fullscreen.ios.poll.ms')
