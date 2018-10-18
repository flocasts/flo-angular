import { NgModule } from '@angular/core'
import { HlsDirective } from './hls.directive'
import {
  SUPPORTS_HLS_NATIVELY, SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION, IVideoElementSupportsHlsCheck,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK, MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK, IMSEInitFunc,
  IMSEDestroyFunc
} from './hls.tokens'
import * as Hls from 'hls.js'

export function defaultIsSupportedFactory() {
  return Hls.isSupported()
}

export function defaultHlsSupportedNativelyFunction(): IVideoElementSupportsHlsCheck {
  return function (ve: HTMLVideoElement) {
    return ve.canPlayType('application/vnd.apple.mpegurl') && !Hls.isSupported() ? true : false
  }
}

export function defaultMseClientInitFunction(): IMSEInitFunc<Hls> {
  return function (initEvent) {
    const client = new Hls()
    client.loadSource(initEvent.src)
    client.attachMedia(initEvent.videoElement)
    client.on(Hls.Events.MANIFEST_PARSED, () => {
      initEvent.readyToPlayTriggerFn()
    })
    // client.on(Hls.Events.ERROR, () => {

    // })
    // client.on('')

    return client
  }
}

export function defaultMseClientDestroyFunction(): IMSEDestroyFunc<Hls> {
  return function (destroyEvent) {
    destroyEvent.clientRef.stopLoad()
    destroyEvent.clientRef.destroy()
  }
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
