import { InjectionToken } from '@angular/core'

export const FS_FULLSCREEN_REQUEST_EVENTS = new InjectionToken<ReadonlyArray<string>>('fs.fullscreen.request')
export const FS_FULLSCREEN_EXIT_EVENTS = new InjectionToken<ReadonlyArray<string>>('fs.fullscreen.exit')
export const FS_FULLSCREEN_CHANGE_EVENTS = new InjectionToken<ReadonlyArray<string>>('fs.fullscreen.change')
export const FS_FULLSCREEN_ELEMENT_ERROR_EVENTS = new InjectionToken<ReadonlyArray<string>>('fs.fullscreen.error')
export const FS_FULLSCREEN_ELEMENT = new InjectionToken<ReadonlyArray<string>>('fs.fullscreen.element')
export const FS_FULLSCREEN_ENABLED = new InjectionToken<ReadonlyArray<string>>('fs.fullscreen.enabled')
