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
  MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK, IMseDestroy, IMseInit, IMseSrcChange
} from './mse.tokens'
import { filter, map, takeUntil, take, skip } from 'rxjs/operators'
import { Subject, combineLatest } from 'rxjs'
import { maybe } from 'typescript-monads'

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
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK) private readonly _mseDestroyTask: IMseDestroy<TMseClient>[]
  ) { }

  private readonly _ngOnDestroy$ = new Subject<undefined>()
  private readonly _ngAfterViewInit$ = new Subject<undefined>()
  private readonly _srcChanges$ = new Subject<string>()
  private readonly _mseClientSource$ = new Subject<TMseClient>()
  private readonly _mseClientMessages$ = new Subject<TMseMessage>()
  public readonly videoElement = this._elementRef.nativeElement

  @Input() public readonly src?: string
  @Output() public readonly srcChange = this._srcChanges$.asObservable().pipe(takeUntil(this._ngOnDestroy$))
  @Output() public readonly mseClient = this._mseClientSource$.asObservable().pipe(takeUntil(this._ngOnDestroy$))
  @Output() public readonly mseClientMessage = this._mseClientMessages$.asObservable().pipe(takeUntil(this._ngOnDestroy$))

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
      .tapSome(src => this._srcChanges$.next(src))
  }

  private readonly _mseClientSupported$ = this._ngAfterViewInit$.pipe(
    filter(_ => this._isMediaSourceSupported)
  )

  private readonly _mseClientNative$ = this._ngAfterViewInit$.pipe(
    filter(_ => !this._isMediaSourceSupported),
    filter(_ => this._nativeSupportCheck(this.videoElement))
  )

  private readonly _nativeClientPathSubscription = combineLatest(
    this._mseClientNative$,
    this._srcChanges$
  ).pipe(
    map(res => res[1]),
    takeUntil(this._ngOnDestroy$)
  ).subscribe(src => {
    this.videoElement.setAttribute('src', src)
  })

  private readonly _mediaSourceClientPathSourceChangeSubscription = combineLatest(
    this._mseClientSupported$,
    this._srcChanges$,
    this.mseClient
  ).pipe(
    skip(1),
    map(res => ({ src: res[1], mseClient: res[2] })),
    takeUntil(this._ngOnDestroy$)
  ).subscribe(res => {
    this._mseSourceChangeTask[0].func({
      clientRef: res.mseClient,
      src: res.src,
      videoElement: this.videoElement
    })
  })

  private readonly _mseClientPathInitSubscription = combineLatest(this._mseClientSupported$, this._srcChanges$)
    .pipe(map(res => res[1]), take(1))
    .subscribe(src => {
      const mseClient = this._mseInitTask[0].func({
        src,
        videoElement: this.videoElement,
        messageSource: this._mseClientMessages$
      })
      this._mseClientSource$.next(mseClient)
    })

  private readonly _destroyPlayerSubscription = combineLatest(this.mseClient, this._ngOnDestroy$)
    .pipe(take(1), map(a => a[0]))
    .subscribe(clientRef => this._mseDestroyTask[0].func({ clientRef, videoElement: this.videoElement }))
}
