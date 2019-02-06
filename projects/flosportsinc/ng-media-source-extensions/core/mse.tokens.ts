import { Subject } from 'rxjs'

export const SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION = 'flo.mse.isSupportedViaMediaSource'
export const SUPPORTS_MSE_TARGET_NATIVELY = 'flo.mse.hasNativeSupport'
export const MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK = 'flo.mse.lib.init'
export const MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK = 'flo.mse.lib.src.change'
export const MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK = 'flo.mse.lib.create'
export const MEDIA_SOURCE_EXTENSION_PATTERN_MATCH = 'flo.mse.lib.pattern'

export interface IMseExecutionContext<TFunc> {
  readonly exectionKey: string
  readonly func: TFunc
}

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

export type IMseInitFunc<TClientRef, TMessage> = (obj: IMseInitOptions<TMessage>) => TClientRef
export type IMseSrcChangeFunc<TClientRef> = (obj: IMseSrcChangeOptions<TClientRef>) => void
export type IMseDestroyFunc<TClientRef> = (obj: IMseDestroyOptions<TClientRef>) => void
export type IVideoElementSupportsTargetMseCheck = (videoElement: HTMLVideoElement) => boolean
export type IMsePatternCheckFunc = (videoSource: string) => boolean
export type IMsePlatformSupportCheckFunc = () => boolean

export interface IMsePatternCheck extends IMseExecutionContext<IMsePatternCheckFunc> { }
export interface IMsePlatformSupportCheck extends IMseExecutionContext<IMsePlatformSupportCheckFunc> { }
export interface IVideoElementSupportsTargetMseCheckContext extends IMseExecutionContext<IVideoElementSupportsTargetMseCheck> { }
export interface IMseSrcChange<TClientRef> extends IMseExecutionContext<IMseSrcChangeFunc<TClientRef>> { }
export interface IMseDestroy<TClientRef> extends IMseExecutionContext<IMseDestroyFunc<TClientRef>> { }
export interface IMseInit<TClientRef, TMessage> extends IMseExecutionContext<IMseInitFunc<TClientRef, TMessage>> { }
