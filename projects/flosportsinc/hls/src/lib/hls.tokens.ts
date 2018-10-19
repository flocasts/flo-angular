import { InjectionToken } from '@angular/core'
import { Subject } from 'rxjs'

export const SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION = new InjectionToken<boolean>('flo.hls.isSupportedViaMediaSource')
export const SUPPORTS_HLS_NATIVELY = new InjectionToken<IVideoElementSupportsHlsCheck>('flo.hls.hasNativeSupport')
export const MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK = new InjectionToken<IMSEInitFunc<any, any>>('flo.hls.mse.lib.init')
export const MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK = new InjectionToken<IMSEDestroyFunc<any>>('flo.hls.mse.lib.create')

export interface IMSEInitOptions<TMessage> {
  readonly src: string
  readonly videoElement: HTMLVideoElement
  readonly readyToPlayTriggerFn: Function
  readonly messageSource: Subject<TMessage>
}

export interface IMSEDestroyOptions<TClientRef> {
  readonly videoElement: HTMLVideoElement
  readonly clientRef: TClientRef
}

export type IVideoElementSupportsHlsCheck = (videoElement: HTMLVideoElement) => boolean
export type IMSEInitFunc<TClientRef, TMessage> = (obj: IMSEInitOptions<TMessage>) => TClientRef
export type IMSEDestroyFunc<TClientRef> = (obj: IMSEDestroyOptions<TClientRef>) => void
