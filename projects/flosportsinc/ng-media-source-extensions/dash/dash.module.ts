import { NgModule } from '@angular/core'
import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, IMseDestroyFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  IVideoElementSupportsTargetMseCheck,
  SUPPORTS_MSE_TARGET_NATIVELY,
  IMseInitFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
  IMseInit,
  IMseDestroy,
  IMsePatternCheck,
  IMsePatternCheckFunc,
  MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
  IVideoElementSupportsTargetMseCheckContext,
  FloMseModule
} from '@flosportsinc/ng-media-source-extensions'
import { MediaPlayerClass, MediaPlayer } from 'dashjs'

const exectionKey = 'DASH'

export interface DashMessage {
  readonly key: string
  readonly message: any
}

export function defaultDashIsSupportedFactory() {
  const func = () => typeof ((window as any).MediaSource || (window as any).WebKitMediaSource) === 'function'
  return {
    exectionKey,
    func
  }
}

export function defaultDashSupportedNativelyFunction(): IVideoElementSupportsTargetMseCheckContext {
  const func: IVideoElementSupportsTargetMseCheck = ve => false
  return {
    exectionKey,
    func
  }
}

export function defaultDashClientInitFunction(): IMseInit<MediaPlayerClass, DashMessage> {
  const func: IMseInitFunc<MediaPlayerClass, DashMessage> = initEvent => {
    const client = MediaPlayer().create()
    client.initialize(initEvent.videoElement, initEvent.src)
    // Object.keys(Hls.Events).forEach(key => {
    //   client.on(Hls.Events[key], (eventKey: any, b) => initEvent.messageSource.next({ key: eventKey, message: b }))
    // })
    return client
  }
  return {
    exectionKey,
    func
  }
}

export function defaultDashClientDestroyFunction(): IMseDestroy<MediaPlayerClass> {
  const func: IMseDestroyFunc<MediaPlayerClass> = destroyEvent => {
    const hadAutoPlay = destroyEvent.videoElement.autoplay
    destroyEvent.videoElement.pause()
    destroyEvent.clientRef.reset()
    hadAutoPlay && destroyEvent.videoElement.setAttribute('autoplay', 'true')
  }
  return {
    exectionKey,
    func
  }
}

export function defaultDashPatternCheck(): IMsePatternCheck {
  const func: IMsePatternCheckFunc = (videoSource: string) => videoSource.includes('.mpd')
  return {
    exectionKey,
    func
  }
}

@NgModule({
  imports: [FloMseModule],
  exports: [FloMseModule],
  providers: [
    {
      provide: SUPPORTS_MSE_TARGET_NATIVELY,
      useFactory: defaultDashSupportedNativelyFunction,
      multi: true
    },
    {
      provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
      useFactory: defaultDashIsSupportedFactory,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
      useFactory: defaultDashClientInitFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
      useFactory: defaultDashClientDestroyFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
      useFactory: defaultDashPatternCheck,
      multi: true
    }
  ]
})
export class FloDashModule { }
