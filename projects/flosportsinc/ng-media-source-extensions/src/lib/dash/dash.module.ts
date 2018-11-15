import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, IMseDestroyFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  IVideoElementSupportsTargetMseCheck,
  SUPPORTS_MSE_TARGET_NATIVELY,
  IMseInitFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
  IMseSrcChangeFunc,
  IMseInit,
  IMseDestroy,
  IMseSrcChange,
  IMsePatternCheck,
  IMsePatternCheckFunc,
  MEDIA_SOURCE_EXTENSION_PATTERN_MATCH
} from '../mse/mse.tokens'
import { NgModule } from '@angular/core'
import { MseModule } from '../mse/mse.module'
import { DashMessage, DashDirective } from './dash.directive'
import { MediaPlayerClass, MediaPlayer } from 'dashjs'

const exectionKey = 'DASH'

export function defaultDashIsSupportedFactory() {
  return typeof ((window as any).MediaSource || (window  as any).WebKitMediaSource) === 'function'
}

export function defaultDashSupportedNativelyFunction(): IVideoElementSupportsTargetMseCheck {
  const dash: IVideoElementSupportsTargetMseCheck = ve =>
    typeof ve.canPlayType === 'function' && ve.canPlayType('application/vnd.apple.mpegurl') &&
      !defaultDashIsSupportedFactory() ? true : false
  return dash
}

export function defaultDashClientInitFunction(): IMseInit<MediaPlayerClass, DashMessage> {
  const func: IMseInitFunc<MediaPlayerClass, DashMessage> = initEvent => {
    const client = MediaPlayer().create()
    client.initialize(initEvent.videoElement, initEvent.src)
    return client
  }
  return {
    exectionKey,
    func
  }
}

export function defaultDashClientSrcChangeFunction(): IMseSrcChange<MediaPlayerClass> {
  const func: IMseSrcChangeFunc<MediaPlayerClass> = srcChangeEvent => {
    srcChangeEvent.clientRef.reset()
    srcChangeEvent.clientRef.attachView(srcChangeEvent.videoElement)
    srcChangeEvent.clientRef.attachSource(srcChangeEvent.src)
  }
  return {
    exectionKey,
    func
  }
}

export function defaultDashClientDestroyFunction(): IMseDestroy<MediaPlayerClass> {
  const func: IMseDestroyFunc<MediaPlayerClass> = destroyEvent => {
    const autoPlayeWasEnabled = destroyEvent.videoElement.autoplay
    destroyEvent.clientRef.reset()
    autoPlayeWasEnabled && destroyEvent.videoElement.setAttribute('autoplay', 'true')
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
  imports: [MseModule],
  declarations: [DashDirective],
  exports: [MseModule, DashDirective],
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
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
      useFactory: defaultDashClientSrcChangeFunction,
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
export class DashModule { }
