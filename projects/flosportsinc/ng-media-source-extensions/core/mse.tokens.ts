import { Subject } from 'rxjs'
import { Type } from '@angular/core'

export const SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION = 'fs.mse.mse-supported' as unknown as Type<any>
export const SUPPORTS_MSE_TARGET_NATIVELY = 'fs.mse.native-supported' as unknown as Type<any>
export const MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK = 'fs.mse.lib.init' as unknown as Type<any>
export const MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK = 'fs.mse.lib.src.change' as unknown as Type<any>
export const MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK = 'fs.mse.lib.create' as unknown as Type<any>
export const MEDIA_SOURCE_EXTENSION_PATTERN_MATCH = 'fs.mse.lib.pattern' as unknown as Type<any>

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
