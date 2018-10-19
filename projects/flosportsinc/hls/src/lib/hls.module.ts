import {
  SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION, IMseDestroyFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  IVideoElementSupportsHlsCheck,
  SUPPORTS_HLS_NATIVELY,
  IMseInitFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
  IMseSrcChangeFunc
} from './hls.tokens'
import { NgModule } from '@angular/core'
import { HlsDirective } from './hls.directive'
import * as Hls from 'hls.js'

export function defaultIsSupportedFactory() {
  return Hls.isSupported()
}

export function defaultHlsSupportedNativelyFunction(): IVideoElementSupportsHlsCheck {
  const lambda: IVideoElementSupportsHlsCheck = ve => ve.canPlayType('application/vnd.apple.mpegurl') && !Hls.isSupported() ? true : false
  return lambda
}

export function defaultMseClientInitFunction(): IMseInitFunc<Hls, any> {
  const lambda: IMseInitFunc<Hls, any> = initEvent => {
    console.log('Init Factory Call')
    const client = new Hls()
    client.loadSource(initEvent.src)
    client.attachMedia(initEvent.videoElement)
    // Object.keys(Hls.Events).forEach(key => {
    //   client.on(Hls.Events[key], (a, b) => initEvent.messageSource.next(b))
    // })
    return client
  }
  return lambda
}

export function defaultMseClientSrcChangeFunction(): IMseSrcChangeFunc<Hls> {
  const lambda: IMseSrcChangeFunc<Hls> = srcChangeEvent => {
    console.log('Src Change Factory Call')
    srcChangeEvent.clientRef.detachMedia()
    srcChangeEvent.clientRef.loadSource(srcChangeEvent.src)
    srcChangeEvent.clientRef.attachMedia(srcChangeEvent.videoElement)
  }
  return lambda
}

export function defaultMseClientDestroyFunction(): IMseDestroyFunc<Hls> {
  const lambda: IMseDestroyFunc<Hls> = destroyEvent => {
    console.log('Destroy Factory Call')
    destroyEvent.clientRef.stopLoad()
    destroyEvent.clientRef.detachMedia()
    destroyEvent.clientRef.destroy()
  }
  return lambda
}

@NgModule({
  declarations: [HlsDirective],
  exports: [HlsDirective],
  providers: [
    {
      provide: SUPPORTS_HLS_NATIVELY,
      useFactory: defaultHlsSupportedNativelyFunction
    },
    {
      provide: SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION,
      useFactory: defaultIsSupportedFactory
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
      useFactory: defaultMseClientInitFunction
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
      useFactory: defaultMseClientSrcChangeFunction
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
      useFactory: defaultMseClientDestroyFunction
    }
  ]
})
export class HlsModule { }