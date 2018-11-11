import { InjectionToken } from '@angular/core'
import { Subject } from 'rxjs'

export const SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION = new InjectionToken<boolean>('flo.hls.isSupportedViaMediaSource')
export const SUPPORTS_HLS_NATIVELY = new InjectionToken<IVideoElementSupportsHlsCheck>('flo.hls.hasNativeSupport')
export const MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK = new InjectionToken<IMseInitFunc<any, any>>('flo.hls.mse.lib.init')
export const MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK = new InjectionToken<IMseSrcChangeFunc<any>>('flo.hls.mse.lib.src.change')
export const MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK = new InjectionToken<IMseDestroyFunc<any>>('flo.hls.mse.lib.create')

export interface IMseInitOptions<TMessage> {
  readonly src: string
  readonly videoElement: HTMLVideoElement
  readonly messageSource: Subject<TMessage>
}

export interface IMseSrcChangeOptions<TClientRef> {
  readonly src: string
  readonly videoElement: HTMLVideoElement
  readonly clientRef: TClientRef
}

export interface IMseDestroyOptions<TClientRef> {
  readonly videoElement: HTMLVideoElement
  readonly clientRef: TClientRef
}

export type IVideoElementSupportsHlsCheck = (videoElement: HTMLVideoElement) => boolean
export type IMseInitFunc<TClientRef, TMessage> = (obj: IMseInitOptions<TMessage>) => TClientRef
export type IMseSrcChangeFunc<TClientRef> = (obj: IMseSrcChangeOptions<TClientRef>) => void
export type IMseDestroyFunc<TClientRef> = (obj: IMseDestroyOptions<TClientRef>) => void
