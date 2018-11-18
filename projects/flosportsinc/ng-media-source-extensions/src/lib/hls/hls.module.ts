import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, IMseDestroyFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  IVideoElementSupportsTargetMseCheck,
  SUPPORTS_MSE_TARGET_NATIVELY,
  IMseInitFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
  IMseSrcChangeFunc,
  IMseDestroy,
  IMseInit,
  IMseSrcChange,
  IMsePatternCheck,
  IMsePatternCheckFunc,
  MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
  IVideoElementSupportsTargetMseCheckContext
} from '../mse/mse.tokens'
import { NgModule, PLATFORM_ID } from '@angular/core'
import { MseModule } from '../mse/mse.module'
import { isPlatformBrowser } from '@angular/common'
import * as Hls from 'hls.js'

const exectionKey = 'HLS'

export interface HlsMessage {
  readonly key: keyof typeof Hls.Events
  readonly message: any
}

export function defaultIsSupportedFactory(platformId: string) {
  const func = () => isPlatformBrowser(platformId) && Hls.isSupported()
  return {
    exectionKey,
    func
  }
}

export function defaultHlsSupportedNativelyFunction(): IVideoElementSupportsTargetMseCheckContext {
  const func: IVideoElementSupportsTargetMseCheck = ve =>
    typeof ve.canPlayType === 'function' && ve.canPlayType('application/vnd.apple.mpegurl') && !Hls.isSupported() ? true : false
  return {
    exectionKey,
    func
  }
}

export function defaultMseClientInitFunction(): IMseInit<Hls, HlsMessage> {
  const func: IMseInitFunc<Hls, HlsMessage> = initEvent => {
    const client = new Hls()
    client.loadSource(initEvent.src)
    client.attachMedia(initEvent.videoElement)
    Object.keys(Hls.Events).forEach(key => {
      client.on(Hls.Events[key], (eventKey: any, b) => initEvent.messageSource.next({ key: eventKey, message: b }))
    })
    return client
  }
  return {
    exectionKey,
    func
  }
}

export function defaultMseClientSrcChangeFunction(): IMseSrcChange<Hls> {
  const func: IMseSrcChangeFunc<Hls> = srcChangeEvent => {
    srcChangeEvent.videoElement.pause()
    srcChangeEvent.clientRef.detachMedia()
    srcChangeEvent.clientRef.loadSource(srcChangeEvent.src)
    srcChangeEvent.clientRef.attachMedia(srcChangeEvent.videoElement)
  }
  return {
    exectionKey,
    func
  }
}

export function defaultMseClientDestroyFunction(): IMseDestroy<Hls> {
  const func: IMseDestroyFunc<Hls> = destroyEvent => {
    destroyEvent.clientRef.stopLoad()
    destroyEvent.clientRef.detachMedia()
    destroyEvent.clientRef.destroy()
  }
  return {
    exectionKey,
    func
  }
}

export function defaultHlsPatternCheck(): IMsePatternCheck {
  const func: IMsePatternCheckFunc = (videoSource: string) => videoSource.includes('.m3u8')
  return {
    exectionKey,
    func
  }
}

@NgModule({
  imports: [MseModule],
  providers: [
    {
      provide: SUPPORTS_MSE_TARGET_NATIVELY,
      useFactory: defaultHlsSupportedNativelyFunction,
      multi: true
    },
    {
      provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
      useFactory: defaultIsSupportedFactory,
      deps: [PLATFORM_ID],
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
      useFactory: defaultMseClientInitFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
      useFactory: defaultMseClientSrcChangeFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
      useFactory: defaultMseClientDestroyFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
      useFactory: defaultHlsPatternCheck,
      multi: true
    }
  ]
})
export class HlsModule { }
