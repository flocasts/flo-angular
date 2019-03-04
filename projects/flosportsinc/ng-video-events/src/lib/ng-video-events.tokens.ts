import { InjectionToken } from '@angular/core'
import { ListenerDictionary } from './ng-video-events'

export const VIDEO_PLAYER_EVENT_BINDINGS = new InjectionToken<ListenerDictionary>('flo.video.event.bindings')
