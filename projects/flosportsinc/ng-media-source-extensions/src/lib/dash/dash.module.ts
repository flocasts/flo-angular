import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, IMseDestroyFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  IVideoElementSupportsTargetMseCheck,
  SUPPORTS_MSE_TARGET_NATIVELY,
  IMseInitFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
  IMseSrcChangeFunc
} from '../mse/mse.tokens'
import { NgModule } from '@angular/core'
import { MseModule } from '../mse/mse.module'
import { DashMessage, DashDirective } from './dash.directive'
import { MediaPlayerClass, MediaPlayer } from 'dashjs'

export function defaultDashIsSupportedFactory() {
  return true // typeof ( window.MediaSource || window.WebKitMediaSource ) === 'function'
}

export function defaultDashSupportedNativelyFunction(): IVideoElementSupportsTargetMseCheck {
  const dash: IVideoElementSupportsTargetMseCheck = ve =>
    typeof ve.canPlayType === 'function' && ve.canPlayType('application/vnd.apple.mpegurl') &&
      !defaultDashIsSupportedFactory() ? true : false
  return dash
}

export function defaultDashClientInitFunction(): IMseInitFunc<MediaPlayerClass, DashMessage> {
  const dash: IMseInitFunc<MediaPlayerClass, DashMessage> = initEvent => {
    const client = MediaPlayer().create()
    client.initialize(initEvent.videoElement, initEvent.src)
    // client.attachMedia(initEvent.videoElement)
    // Object.keys(Hls.Events).forEach(key => {
    //   client.on(Hls.Events[key], (eventKey: any, b) => initEvent.messageSource.next({ key: eventKey, message: b }))
    // })
    return client
  }
  return dash
}

export function defaultDashClientSrcChangeFunction(): IMseSrcChangeFunc<MediaPlayerClass> {
  const dash: IMseSrcChangeFunc<MediaPlayerClass> = srcChangeEvent => {
    srcChangeEvent.clientRef.reset()
    // srcChangeEvent.clientRef.detachMedia()
    // srcChangeEvent.clientRef.loadSource(srcChangeEvent.src)
    // srcChangeEvent.clientRef.attachMedia(srcChangeEvent.videoElement)
  }
  return dash
}

export function defaultDashClientDestroyFunction(): IMseDestroyFunc<MediaPlayerClass> {
  const dash: IMseDestroyFunc<MediaPlayerClass> = destroyEvent => {
    // destroyEvent.clientRef.stopLoad()
    // destroyEvent.clientRef.detachMedia()
    // destroyEvent.clientRef.destroy()
  }
  return dash
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
    }
  ]
})
export class DashModule { }
