import { Directive, ElementRef, Inject, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core'
import { ListenerDictionary, FloVideoEventHandler } from './ng-video-events'
import { Subject } from 'rxjs'
import {
  VIDEO_PLAYER_EVENT_BINDINGS, VIDEO_PLAYER_EVENT_UUID_GENERATOR,
  VideoPlayerEventsIdGeneratorFunc, VideoPlayerEventsIdTabGeneratorFunc,
  VIDEO_PLAYER_EVENT_UUID_TAB_GENERATOR
} from './ng-video-events.tokens'

interface IEventHandler {
  readonly [key: string]: { readonly func: FloVideoEventHandler, readonly event: string }
}

const combineListenerDicitonaries =
  (dicts: ReadonlyArray<ListenerDictionary>): IEventHandler =>
    dicts
      .reduce((acc, curr, idx) => {
        return {
          ...acc,
          ...Object.keys(curr).reduce((a, c) => {
            return typeof curr[c] === 'function'
              ? { ...a, [`${idx}_${c}`]: { event: c, func: curr[c] } }
              : a
          }, {} as { readonly func: FloVideoEventHandler, readonly event: string })
        }
      }, {})

@Directive({
  selector: 'video[floVideoEvents]'
})
export class FloVideoEventsDirective<TMeta, TMessage> implements OnInit, OnDestroy {

  constructor(private elementRef: ElementRef<HTMLVideoElement>,
    @Inject(VIDEO_PLAYER_EVENT_UUID_GENERATOR) private uniqueIdGenerator: VideoPlayerEventsIdGeneratorFunc,
    @Inject(VIDEO_PLAYER_EVENT_UUID_TAB_GENERATOR) private uniqueIdTabGenerator: VideoPlayerEventsIdTabGeneratorFunc,
    // tslint:disable-next-line: readonly-array
    @Inject(VIDEO_PLAYER_EVENT_BINDINGS) private videoEventBindings: ListenerDictionary[]) {
  }

  @Input() public readonly floVideoEvents?: TMeta
  @Output() public readonly floVideoEventMessage = new EventEmitter<TMessage>()

  // tslint:disable-next-line: readonly-keyword
  private handlerReferences: { [key: string]: any } = {}

  private readonly onDestroy = new Subject()
  private readonly onDestroy$ = this.onDestroy.asObservable()
  private readonly handlers = combineListenerDicitonaries(this.videoEventBindings)

  public readonly videoElement = this.elementRef.nativeElement
  public readonly uniqueId = this.uniqueIdGenerator()
  public readonly windowId = this.uniqueIdTabGenerator()

  private readonly emitMessage = (msg: TMessage) => this.floVideoEventMessage.next(msg)

  ngOnInit() {
    Object.keys(this.handlers)
      .forEach(k => {
        const val = this.handlers[k]
        const listener =
          (evt: Event) =>
            val.func(evt, this.videoElement, this.uniqueId, this.windowId,
              this.floVideoEvents, this.emitMessage.bind(this), this.onDestroy$)

        // tslint:disable-next-line: no-object-mutation
        this.handlerReferences[k] = listener
        this.videoElement.addEventListener(val.event, this.handlerReferences[k], { passive: true })
      })
  }

  ngOnDestroy() {
    this.onDestroy.next()
    Object.keys(this.handlers)
      .filter(k => this.handlers[k])
      .forEach(k => {
        this.videoElement.removeEventListener((this.handlers[k] as any).event, this.handlerReferences[k], false)
      })
  }
}
