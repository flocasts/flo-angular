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
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, SUPPORTS_MSE_TARGET_NATIVELY, IVideoElementSupportsTargetMseCheck,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK, MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK, IMseDestroy, IMseInit, IMseSrcChange, IMsePatternCheck,
  MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
  IMseExecutionContext
} from './mse.tokens'
import { filter, map, takeUntil, take, skip, startWith } from 'rxjs/operators'
import { Subject, combineLatest, BehaviorSubject, timer } from 'rxjs'
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

@Directive({
  selector: 'video[floMse]'
})
export class MseDirective<TMseClient, TMseMessage> implements OnDestroy, OnChanges, AfterViewInit {
  // tslint:disable:readonly-array
  constructor(readonly _elementRef: ElementRef<HTMLVideoElement>,
    @Inject(SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION) private readonly _isMediaSourceSupported: boolean,
    @Inject(SUPPORTS_MSE_TARGET_NATIVELY) private readonly _nativeSupportCheck: IVideoElementSupportsTargetMseCheck,
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK) private readonly _mseInitTask: IMseInit<TMseClient, TMseMessage>[],
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK) private readonly _mseSourceChangeTask: IMseSrcChange<TMseClient>[],
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK) private readonly _mseDestroyTask: IMseDestroy<TMseClient>[],
    @Inject(MEDIA_SOURCE_EXTENSION_PATTERN_MATCH) private readonly _msePatternCheckTask: IMsePatternCheck[]
  ) { }

  private readonly _ngOnDestroy$ = new Subject<undefined>()
  private readonly _ngAfterViewInit$ = new Subject<undefined>()
  private readonly _srcChanges$ = new Subject<SourceChangeEvent>()
  private readonly _mseClientSource$ = new BehaviorSubject<TMseClient | undefined>(undefined)
  private readonly _mseClientMessages$ = new Subject<TMseMessage>()
  public readonly videoElement = this._elementRef.nativeElement

  @Input() public readonly src?: string
  @Output() public readonly srcChange = this._srcChanges$.asObservable().pipe(takeUntil(this._ngOnDestroy$))
  @Output() public readonly mseClient = this._mseClientSource$.asObservable().pipe(startWith(undefined), takeUntil(this._ngOnDestroy$))
  @Output() public readonly mseClientMessage = this._mseClientMessages$.asObservable().pipe(takeUntil(this._ngOnDestroy$))

  // tslint:disable-next-line:readonly-keyword
  protected executionKey: string

  private readonly extractTaskFromContext =
    <T>(ctxs: IMseExecutionContext<T>[]) =>
      maybe(ctxs.find(a => a.exectionKey === this.executionKey))


  private readonly safelyExtractInjectedFunc = <T>(ctxs: IMseExecutionContext<T>[]) => (srcString?: string) =>
    maybe(srcString)
      .flatMap(src => this.extractTaskFromContext(this._msePatternCheckTask)
        .filter(patternCheck => {
          return patternCheck.func(src)
        }))
      .flatMap(() => this.extractTaskFromContext(ctxs).map(b => b.func))

  public ngAfterViewInit() {
    emitAndUnsubscribe(this._ngAfterViewInit$)
  }

  public ngOnDestroy() {
    emitAndUnsubscribe(this._ngOnDestroy$)
    this._mediaSourceClientPathSourceChangeSubscription.unsubscribe()
    this._nativeClientPathSubscription.unsubscribe()
    this._mseClientPathInitSubscription.unsubscribe()
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

  private readonly _mseClientSupported$ = this._ngAfterViewInit$.pipe(
    filter(_ => this._isMediaSourceSupported)
  )

  private readonly _mseClientNative$ = this._ngAfterViewInit$.pipe(
    filter(_ => !this._isMediaSourceSupported),
    filter(_ => this._nativeSupportCheck(this.videoElement))
  )

  private readonly _setSrc = (evt: SourceChangeEvent) => evt.current.tapSome(src => this.videoElement.setAttribute('src', src))

  private readonly _nativeClientPathSubscription = combineLatest(
    this._mseClientNative$,
    this._srcChanges$
  ).pipe(
    map(res => res[1]),
    takeUntil(this._ngOnDestroy$)
  ).subscribe(src => {
    this._setSrc(src)
  })

  private readonly _mediaSourceClientPathSourceChangeSubscription = combineLatest(
    this._mseClientSupported$,
    this._srcChanges$
  ).pipe(
    skip(1),
    map(res => ({ src: res[1] })),
    takeUntil(this._ngOnDestroy$)
  ).subscribe(res => {
    maybe(this._mseClientSource$.getValue())
      .tap({
        some: mseClient => {
          this.safelyExtractInjectedFunc(this._mseSourceChangeTask)(this.src)
            .tap({
              some: srcChangeFunc => {
                // tslint:disable-next-line:no-if-statement
                if (res.src.previous.valueOrUndefined()) {
                  srcChangeFunc({
                    clientRef: mseClient,
                    src: res.src.current.valueOr(''),
                    videoElement: this.videoElement
                  })
                }
              },
              none: () => {
                res.src.previous.tapSome(previous => {
                  this.safelyExtractInjectedFunc(this._mseDestroyTask)(previous)
                    .tapSome(funcc => {
                      funcc({ clientRef: mseClient, videoElement: this.videoElement })
                      this._mseClientSource$.next(undefined)
                      this._setSrc(res.src)
                    })
                })
              }
            })
        },
        none: () => {
          res.src.current.tapSome(currentSource => {
            this.safelyExtractInjectedFunc(this._mseInitTask)(currentSource)
              .tap({
                some: initFunc => {
                  setTimeout(() => {
                    const mseClient = initFunc({
                      src: currentSource,
                      videoElement: this.videoElement,
                      messageSource: this._mseClientMessages$
                    })
                    this._mseClientSource$.next(mseClient)
                  })
                }
              })
          })
        }
      })
  })

  private readonly _mseClientPathInitSubscription = combineLatest(this._mseClientSupported$, this._srcChanges$)
    .pipe(map(res => res[1]), take(1))
    .subscribe(src => {
      this.safelyExtractInjectedFunc(this._mseInitTask)(this.src)
        .tapSome(func => {
          const mseClient = func({
            src: src.current.valueOr(''),
            videoElement: this.videoElement,
            messageSource: this._mseClientMessages$
          })
          this._mseClientSource$.next(mseClient)
        })
    })

  private readonly _destroyPlayerSubscription = combineLatest(this.mseClient, this._ngOnDestroy$)
    .pipe(take(1), map(a => a[0]))
    .subscribe(clientRef => {
      clientRef && this.safelyExtractInjectedFunc(this._mseDestroyTask)(this.src)
        .tapSome(func => func({ clientRef, videoElement: this.videoElement }))
    })
}
