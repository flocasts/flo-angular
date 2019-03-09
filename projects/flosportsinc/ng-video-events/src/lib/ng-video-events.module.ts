import { NgModule, PLATFORM_ID } from '@angular/core'
import { FloVideoEventsDirective } from './ng-video-events.directive'
import { isPlatformServer } from '@angular/common'
import { maybe } from 'typescript-monads'
import {
  VIDEO_PLAYER_EVENT_BINDINGS, VIDEO_PLAYER_EVENT_UUID_GENERATOR,
  VideoPlayerEventsIdGeneratorFunc, VideoPlayerEventsIdTabGeneratorFunc,
  VIDEO_PLAYER_EVENT_UUID_TAB_GENERATOR
} from './ng-video-events.tokens'
import * as v4_ from 'uuid/v4'

const v4 = v4_

export function defaultIdGenerator(): VideoPlayerEventsIdGeneratorFunc {
  const lambda = () => v4()
  return lambda
}

export function defaultTabIdGenerator(platformId: string): VideoPlayerEventsIdTabGeneratorFunc {
  const lambda = () => {
    // tslint:disable-next-line: no-if-statement
    if (isPlatformServer(platformId) || typeof sessionStorage === 'undefined') { return '' }

    const SHARED_WIN_KEY = 'FLO-VIDEO-EVTS-TAB-ID'
    const fetchKey = () => sessionStorage.getItem(SHARED_WIN_KEY)

    return maybe(fetchKey())
      .valueOrCompute(() => {
        sessionStorage.setItem(SHARED_WIN_KEY, v4())
        return fetchKey() as string
      })
  }
  return lambda
}

@NgModule({
  declarations: [FloVideoEventsDirective],
  exports: [FloVideoEventsDirective],
  providers: [
    {
      provide: VIDEO_PLAYER_EVENT_UUID_GENERATOR,
      useFactory: defaultIdGenerator
    },
    {
      provide: VIDEO_PLAYER_EVENT_UUID_TAB_GENERATOR,
      useFactory: defaultTabIdGenerator,
      deps: [PLATFORM_ID]
    },
    {
      provide: VIDEO_PLAYER_EVENT_BINDINGS,
      multi: true,
      useValue: {}
    }
  ]
})
export class FloVideoEventsModule { }
