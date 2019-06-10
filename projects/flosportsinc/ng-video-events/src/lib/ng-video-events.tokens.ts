import { InjectionToken } from '@angular/core'
import { ListenerDictionary } from './ng-video-events'

export type VideoPlayerEventsIdGeneratorFunc = () => string
export type VideoPlayerEventsIdTabGeneratorFunc = () => string

export const VIDEO_PLAYER_EVENT_BINDINGS = new InjectionToken<ListenerDictionary>('fs.ve.bndg')
export const VIDEO_PLAYER_EVENT_UUID_GENERATOR = new InjectionToken<VideoPlayerEventsIdGeneratorFunc>('fs.ve.bndg.uuidgen')
export const VIDEO_PLAYER_EVENT_UUID_TAB_GENERATOR =
  new InjectionToken<VideoPlayerEventsIdTabGeneratorFunc>('fs.ve.bndg.uuidtabgen')
