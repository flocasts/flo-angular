import { Directive, ElementRef, Inject } from '@angular/core'
import { ListenerDictionary, FloVideoEventHandler } from './ng-video-events'
import {
  VIDEO_PLAYER_EVENT_BINDINGS, VIDEO_PLAYER_EVENT_UUID_GENERATOR,
  VideoPlayerEventsIdGeneratorFunc, VideoPlayerEventsIdTabGeneratorFunc,
  VIDEO_PLAYER_EVENT_UUID_TAB_GENERATOR
} from './ng-video-events.tokens'

// const objPropIsFunction = (obj: any) => (b: string) => typeof obj[b] === 'function'

@Directive({
  selector: 'video[floVideoEvents]'
})
export class FloVideoEventsDirective {
  constructor(private elementRef: ElementRef<HTMLVideoElement>,
    @Inject(VIDEO_PLAYER_EVENT_UUID_GENERATOR) private uniqueIdGenerator: VideoPlayerEventsIdGeneratorFunc,
    @Inject(VIDEO_PLAYER_EVENT_UUID_TAB_GENERATOR) private uniqueIdTabGenerator: VideoPlayerEventsIdTabGeneratorFunc,
    // tslint:disable-next-line: readonly-array
    @Inject(VIDEO_PLAYER_EVENT_BINDINGS) private videoEventBindings: ListenerDictionary[]) {
  }

  // tslint:disable-next-line: readonly-keyword
  private handlerDictionary: { readonly [key: string]: FloVideoEventHandler } = {}

  public readonly videoElement = this.elementRef.nativeElement
  public readonly uniqueId = this.uniqueIdGenerator()
  public readonly windowId = this.uniqueIdTabGenerator()

  // dispatchCustomEventSafely(type: string, detail?: any) {
  //   this.maybeVideoElement().tap({
  //     none: () => undefined,
  //     some: el => dispatchCustomEvent(type, el, detail)
  //   })
  // }

  // prepareAndAddListeners<T>(hlsFactoryMeta?: T) {
  //   this.doIfMarkedVideoElementIsReady(ve => {
  //     this.addListeners(
  //       ve,
  //       this.id,
  //       this.groupId,
  //       this.listeners,
  //       this.listRefMap,
  //       this.maybeHlsInstance()
  //         .match({
  //           none: () => this.eventMeta,
  //           some: hlsInstance => ({ hlsInstance, ...this.eventMeta })
  //         }),
  //       hlsFactoryMeta
  //     )
  //   })
  // }

  // prepareAndRemoveListeners() {
  //   this.doIfMarkedVideoElementIsReady(ve => {
  //     this.unloadListeners(ve, this.listeners, this.listRefMap)
  //   })
  // }

  // errorEmitterFn(code: number, message?: string) {
  //   this.errorSource.next({
  //     message,
  //     code
  //   })
  // }

  // addListeners(videoElement: HTMLVideoElement,
  //   videoPlayerInstanceId: string,
  //   videoGroupId: string,
  //   listeners: ListenerDictionary,
  //   listenerRefs: any,
  //   eventMeta?: Object) {
  //   const merged: ReadonlyArray<ListenerDictionary> = [
  //     ...(this.videoEventBindings || []),
  //     listeners
  //   ]

  //   merged.forEach((a: any, idx) => {
  //     Object.keys(a)
  //       .filter(objPropIsFunction)
  //       .forEach(key => {
  //         const refKey = `${key}_${idx}`
  //         const listener: FloVideoEventHandler = (evt: Event) =>
  //           ((ve: HTMLVideoElement,
  //             playerId: string,
  //             playerGroupId: string,
  //             meta: any,
  //             emitErrorFn) => {
  //             a[key](
  //               evt,
  //               ve,
  //               playerId,
  //               playerGroupId,
  //               meta,
  //               emitErrorFn
  //             )
  //           })(
  //             videoElement,
  //             videoPlayerInstanceId,
  //             videoGroupId,
  //             eventMeta,
  //           )
  //         // tslint:disable-next-line:no-object-mutation
  //         listenerRefs[refKey] = listener
  //         videoElement.addEventListener(key, listener as any, { passive: true })
  //       })
  //   })
  // }

  // unloadListeners(videoElement: HTMLVideoElement, listeners: ListenerDictionary, listenerRefs: any) {
  //   const merged: ReadonlyArray<ListenerDictionary> = [
  //     ...(this.videoEventBindings || []),
  //     listeners
  //   ]
  //   // TODO: this should only have 1 side-effect iterator fn
  //   merged.forEach((a, idx) => {
  //     Object.keys(a)
  //       .filter(objPropIsFunction)
  //       .forEach(key => {
  //         videoElement.removeEventListener(key, listenerRefs[`${key}_${idx}`])
  //       })
  //   })
  // }
}
