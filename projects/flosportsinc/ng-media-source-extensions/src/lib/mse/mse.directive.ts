import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
  Inject,
  Output
} from '@angular/core'
import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, SUPPORTS_MSE_TARGET_NATIVELY,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK, MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK, IMseDestroy, IMseInit, IMseSrcChange, IMsePatternCheck,
  MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
  IMseExecutionContext,
  IMsePlatformSupportCheck,
  IVideoElementSupportsTargetMseCheckContext
} from './mse.tokens'
import { map, takeUntil, take, startWith } from 'rxjs/operators'
import { Subject, combineLatest, BehaviorSubject } from 'rxjs'
import { maybe, IMaybe } from 'typescript-monads'

export const emitAndUnsubscribe = (subject: Subject<undefined>) => {
  // tslint:disable-next-line:no-if-statement
  if (subject.closed) { return }
  subject.next()
  subject.unsubscribe()
}

export interface IMseClientReadyEvent<TMseClient> {
  readonly mseClient: TMseClient
  readonly videoElement: HTMLVideoElement
}

interface SourceChangeEvent {
  readonly previous: IMaybe<string>
  readonly current: IMaybe<string>
}

interface MseClientContext<TMseClient> {
  readonly mseClient: IMaybe<TMseClient>
  readonly contextKey: IMaybe<string>
}

@Directive({
  selector: 'video[floMse]'
})
export class MseDirective<TMseClient, TMseMessage> implements OnDestroy, OnChanges, AfterViewInit {
  // tslint:disable:readonly-array
  constructor(readonly _elementRef: ElementRef<HTMLVideoElement>,
    @Inject(SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION) private readonly _isMediaSourceSupported: IMsePlatformSupportCheck[],
    @Inject(SUPPORTS_MSE_TARGET_NATIVELY) private readonly _nativeSupportCheck: IVideoElementSupportsTargetMseCheckContext[],
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK) private readonly _mseInitTask: IMseInit<TMseClient, TMseMessage>[],
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK) private readonly _mseSourceChangeTask: IMseSrcChange<TMseClient>[],
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK) private readonly _mseDestroyTask: IMseDestroy<TMseClient>[],
    @Inject(MEDIA_SOURCE_EXTENSION_PATTERN_MATCH) private readonly _msePatternCheckTask: IMsePatternCheck[]
  ) { }

  private readonly _ngOnDestroy$ = new Subject<undefined>()
  private readonly _ngAfterViewInit$ = new Subject<undefined>()
  private readonly _srcChanges$ = new Subject<SourceChangeEvent>()
  private readonly _mseClientSource$ = new BehaviorSubject<MseClientContext<TMseClient>>({ contextKey: maybe(), mseClient: maybe() })
  private readonly _mseClientMessages$ = new Subject<TMseMessage>()
  public readonly videoElement = this._elementRef.nativeElement

  @Input() public readonly src?: string
  @Output() public readonly srcChange = this._srcChanges$.asObservable().pipe(takeUntil(this._ngOnDestroy$))
  @Output() public readonly mseClient = this._mseClientSource$.asObservable().pipe(startWith(undefined), takeUntil(this._ngOnDestroy$))
  @Output() public readonly mseClientMessage = this._mseClientMessages$.asObservable().pipe(takeUntil(this._ngOnDestroy$))

  private readonly _extractExecutableFromTaskContexts =
    <T>(ctxs: IMseExecutionContext<T>[]) =>
      (src?: string) => {
        return maybe(src)
          .flatMap(s => maybe(this._msePatternCheckTask.filter(a => a.func(s))[0]))
          .flatMap(a => maybe(ctxs.find(b => b.exectionKey === a.exectionKey)))
      }

  private readonly _getExecutionKey =
    (src: string) =>
      maybe(this._msePatternCheckTask.find(a => a.func(src)))
        .map(a => a.exectionKey)

  public ngAfterViewInit() {
    emitAndUnsubscribe(this._ngAfterViewInit$)
  }

  public ngOnDestroy() {
    emitAndUnsubscribe(this._ngOnDestroy$)
    this._mediaSourceClientPathSourceChangeSubscription.unsubscribe()
    this._destroyPlayerSubscription.unsubscribe()
  }

  public ngOnChanges(changes: SimpleChanges) {
    maybe(changes.src)
      .flatMap(a => a.currentValue === a.previousValue
        ? maybe<string>()
        : maybe<string>(a.currentValue))
      .tapSome(() => this._srcChanges$.next({
        current: maybe(changes.src.currentValue),
        previous: maybe(changes.src.previousValue)
      }))
  }

  private readonly _setSrc = (evt: SourceChangeEvent) => evt.current.tapSome(src => this.videoElement.setAttribute('src', src))

  private readonly _Tt =
    (src: IMaybe<string>) =>
      <T>(ctxs: IMseExecutionContext<T>[]) =>
        src.flatMap(s => {
          return this._extractExecutableFromTaskContexts(ctxs)(s)
            .map(ctx => {
              return {
                func: ctx.func,
                exectionKey: ctx.exectionKey,
                src: s
              }
            })
        })

  private readonly _mediaSourceClientPathSourceChangeSubscription = this._srcChanges$.pipe(
    takeUntil(this._ngOnDestroy$)
  ).subscribe(srcChange => {
    // SHOULD WE TRY TO INIT AN MSE CLIENT? DOES THE CURRENT-SRC REQUIRE/SUPPORT AN MSE CLIENT
    // YES
    // IS THERE A CURRENT MSE CLIENT, IF SO IS IT THE SAME AS THE CURRENT-SRC REQUIREMENT?
    // IF SAME, EXECUTE SRC_CHANGE TAKS
    // IF DIFFERENT, TEARDOWN PREVIOUS-SRC MSE AND INIT CURRENT-SRC MSE
    // NO
    // ATTEMPT TO TEAR DOWN PREVIOUS-SRC MSE
    this._Tt(srcChange.current)(this._mseInitTask)
      .tap({
        // detected MSE client by matching url in source change
        some: ctx => {
          srcChange.current
            .flatMap(this._getExecutionKey)
            .flatMap(currentExecutionKey => srcChange.previous
              .flatMap(this._getExecutionKey)
              .filter(previousExecutionKey => previousExecutionKey !== currentExecutionKey))
            .tap({
              some: execKey => {
                // Different MSE clients
                // destory old
                // init new
                this._mseClientSource$.getValue().mseClient
                  .tap({
                    some: clientRef => {
                      maybe(this._mseDestroyTask.find(a => a.exectionKey === execKey))
                        .tapSome(destroyFunc => destroyFunc.func({ clientRef, videoElement: this.videoElement }))
                    },
                    none: () => {
                      // TODO
                    }
                  })

                const mseClient = ctx.func({
                  src: ctx.src,
                  videoElement: this.videoElement,
                  messageSource: this._mseClientMessages$
                })
                this._mseClientSource$.next({ mseClient: maybe(mseClient), contextKey: maybe(ctx.exectionKey) })
              },
              none: () => {
                // Same MSE clients
                // MSE Client already running?
                // YES => update source
                // NO => init
                this._mseClientSource$.getValue().mseClient
                  .tap({
                    none: () => {
                      const mseClient = ctx.func({
                        src: ctx.src,
                        videoElement: this.videoElement,
                        messageSource: this._mseClientMessages$
                      })
                      this._mseClientSource$.next({ mseClient: maybe(mseClient), contextKey: maybe(ctx.exectionKey) })
                    },
                    some: clientRef => {
                      this._Tt(srcChange.current)(this._mseSourceChangeTask)
                        .tapSome(ct => {
                          ct.func({
                            clientRef,
                            src: ct.src,
                            videoElement: this.videoElement
                          })
                        })
                    }
                  })
              }
            })
        },
        // No MSE client associated to this video url, attempt native plaback and cleanup old MSE clients
        none: () => {
          this._Tt(srcChange.previous)(this._mseDestroyTask)
            .tap({
              none: () => this._setSrc(srcChange),
              some: destroy => {
                this._mseClientSource$.getValue().mseClient
                  .tapSome(clientRef => {
                    destroy.func({
                      clientRef,
                      videoElement: this.videoElement
                    })
                    this._mseClientSource$.next({ contextKey: maybe(), mseClient: maybe() })
                    this._setSrc(srcChange)
                  })
              }
            })
        }
      })
  })

  private readonly _destroyPlayerSubscription = combineLatest(this.mseClient, this._ngOnDestroy$)
    .pipe(take(1), map(a => a[0]))
    .subscribe(clientRef => clientRef.mseClient
      .flatMap(mseRef => clientRef.contextKey
        .flatMap(execKey => maybe(this._mseDestroyTask.find(a => a.exectionKey === execKey)))
        .map(ctx => {
          return {
            func: ctx.func,
            client: mseRef
          }
        })).tapSome(ctx => {
          ctx.func({
            clientRef: ctx.client,
            videoElement: this.videoElement
          })
        }))
}
