import { Subject } from 'rxjs'
import { InjectionToken } from '@angular/core'

export const SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION = new InjectionToken('fs.mse.mse-supported')
export const SUPPORTS_MSE_TARGET_NATIVELY = new InjectionToken('fs.mse.native-supported')
export const MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK = new InjectionToken('fs.mse.lib.init')
export const MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK = new InjectionToken('fs.mse.lib.create')
export const MEDIA_SOURCE_EXTENSION_PATTERN_MATCH = new InjectionToken('fs.mse.lib.pattern')

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
