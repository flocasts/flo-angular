import {
  SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION, IMSEDestroyFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  IVideoElementSupportsHlsCheck,
  SUPPORTS_HLS_NATIVELY,
  IMSEInitFunc,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK
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

export function defaultMseClientInitFunction(): IMSEInitFunc<Hls, any> {
  const lambda: IMSEInitFunc<Hls, any> = initEvent => {
    const client = new Hls()
    console.log('INIT!')
    // client.on(Hls.Events.ERROR, console.log)
    // client.attachMedia(initEvent.videoElement)
    // client.on(Hls.Events.ERROR, console.log)
    Object.keys(Hls.Events).forEach(key => {
      client.on(Hls.Events[key], (a, b) => initEvent.messageSource.next(b))
    })
    return client
  }
  return lambda
}

export function defaultMseClientDestroyFunction(): IMSEDestroyFunc<Hls> {
  const lambda: IMSEDestroyFunc<Hls> = destroyEvent => {
    console.log('DESTROY')
    // destroyEvent.clientRef.stopLoad()
    // destroyEvent.clientRef.detachMedia()
    // destroyEvent.clientRef.destroy()
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
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
      useFactory: defaultMseClientDestroyFunction
    }
  ]
})
export class HlsModule { }
