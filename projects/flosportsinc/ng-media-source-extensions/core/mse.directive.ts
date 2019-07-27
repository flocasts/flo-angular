import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  Inject,
  Output,
  OnInit
} from '@angular/core'
import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, SUPPORTS_MSE_TARGET_NATIVELY,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK, MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  IMseDestroy, IMseInit, IMsePatternCheck,
  MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
  IMsePlatformSupportCheck,
  IVideoElementSupportsTargetMseCheckContext
} from './mse.tokens'
import { Subject } from 'rxjs'
import { maybe } from 'typescript-monads'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
// tslint:disable: no-if-statement
// tslint:disable:readonly-array

export interface IMseClientReadyEvent<TMseClient> {
  readonly mseClient: TMseClient
  readonly videoElement: HTMLVideoElement
}

@Directive({
  selector: 'video[floMse]'
})
export class MseDirective<TMseClient, TMseMessage> implements OnInit, OnDestroy, OnChanges {
  constructor(readonly _elementRef: ElementRef<HTMLVideoElement>,
    @Inject(SUPPORTS_MSE_TARGET_NATIVELY) private readonly _nativeSupportCheck: IVideoElementSupportsTargetMseCheckContext[],
    @Inject(SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION) private readonly _isMediaSourceSupported: IMsePlatformSupportCheck[],
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK) private readonly _mseInitTasks: IMseInit<TMseClient, TMseMessage>[],
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK) private readonly _mseDestroyTask: IMseDestroy<TMseClient>[],
    @Inject(MEDIA_SOURCE_EXTENSION_PATTERN_MATCH) private readonly _msePatternCheckTask: IMsePatternCheck[]
  ) { }

  public readonly videoElement = this._elementRef.nativeElement

  private _enabled = true
  private _src?: string
  private _mseClient?: TMseClient

  @Input('floMse')
  get enabled() {
    return this._enabled
  }
  set enabled(val: boolean) {
    if ((val as any) === 'false' || val === false || (val as any) === 0 || val === undefined || val === null) {
      this._enabled = false
    } else {
      this._enabled = true
    }
  }

  get disabled() { return !this.enabled }

  @Input()
  get src() {
    return this._src
  }
  set src(val: string | undefined) {
    this._src = val
    this.srcChange.next(val)
  }

  public setSrc = (val: string) => {
    this.src = val
  }

  @Input()
  get floMseClient() {
    return this._mseClient
  }
  set floMseClient(val: TMseClient | undefined) {
    this._mseClient = val
    this.floMseClientChange.next(val)
  }

  public setMseClient = (val?: TMseClient) => {
    this.floMseClient = val
  }

  @Output() public readonly srcChange = new Subject<string | undefined>()
  @Output() public readonly floMseClientChange = new Subject<TMseClient | undefined>()
  @Output() public readonly floMseClientMessageChange = new Subject<TMseMessage>()

  private readonly getExecutionKey =
    (src?: string) =>
      maybe(src).flatMapAuto(s => this._msePatternCheckTask.find(a => a.func(s))).map(a => a.exectionKey)

  private readonly getTasks =
    (src?: string) =>
      this.getExecutionKey(src)
        .map(currentExecutionKey => {
          const canExec = maybe(this._isMediaSourceSupported.find(b => b.exectionKey === currentExecutionKey))
            .map(a => a.func())
            .filter(Boolean)

          return {
            initialize: canExec.flatMapAuto(_ => this._mseInitTasks.find(b => b.exectionKey === currentExecutionKey)).map(b => b.func),
            destroy: canExec.flatMapAuto(_ => this._mseDestroyTask.find(b => b.exectionKey === currentExecutionKey)).map(b => b.func)
          }
        })

  private readonly getCurrentTasks = () => this.getTasks(this.src)

  private readonly setSrcUrl = (src: string) => this.videoElement.setAttribute('src', src)

  public ngOnDestroy() {
    if (this.enabled && this.floMseClient) {
      this.getCurrentTasks().flatMap(a => a.destroy).tapSome(fn => {
        fn({
          clientRef: this.floMseClient as TMseClient,
          videoElement: this.videoElement
        })
      })
    }
  }

  public ngOnInit() {
    if (this.disabled) { return }

    maybe(this.src)
      .map(src => this.getCurrentTasks()
        .flatMap(a => a.initialize)
        .match({
          some: tsk => () => {
            this.setMseClient(tsk({
              src,
              messageSource: this.floMseClientMessageChange,
              videoElement: this.videoElement
            }))
          },
          none: () => () => this.setSrcUrl(src)
        }))
      .tapSome(fn => fn())
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!changes.src || changes.src.firstChange) { return }

    // if floMse is disabled, we just want to pass the "src" through as normal
    if (this.disabled && this.src) {
      this.setSrcUrl(this.src)
      return
    }

    maybe(changes.src.currentValue)
      .filter(src => src !== changes.src.previousValue)
      .tapSome(src => {
        const nextTasks = this.getCurrentTasks()
        const nextInitTask = nextTasks.flatMap(a => a.initialize)
        const hasNextMseTask = nextInitTask.isSome()
        const previousValue = this.getExecutionKey(changes.src.previousValue).valueOrUndefined()
        const currentValue = this.getExecutionKey(src).valueOrUndefined()
        const videoElement = this.videoElement

        if (this.floMseClient) {
          const clientRef = this.floMseClient as TMseClient
          if (previousValue === currentValue) {
            nextTasks.flatMap(a => a.destroy)
              .tapSome(fn => fn({ clientRef, videoElement }))
          } else {
            this.getTasks(changes.src.previousValue)
              .flatMap(a => a.destroy)
              .tapSome(fn => fn({ videoElement, clientRef }))
          }
        }

        if (hasNextMseTask) {
          nextInitTask.tapSome(fn => this.setMseClient(fn({
            src,
            messageSource: this.floMseClientMessageChange,
            videoElement
          })))
        } else {
          this.setSrcUrl(src)
          this.setMseClient(undefined)
        }
      })
  }
}
