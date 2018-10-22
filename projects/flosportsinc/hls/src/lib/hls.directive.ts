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
  SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION, SUPPORTS_HLS_NATIVELY, IVideoElementSupportsHlsCheck,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK, MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK, IMseInitFunc,
  IMseDestroyFunc, MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK, IMseSrcChangeFunc
} from './hls.tokens'
import { filter, map, takeUntil, take, skip } from 'rxjs/operators'
import { Subject, combineLatest } from 'rxjs'
import { maybe } from 'typescript-monads'

const emitAndUnsubscribe = (subject: Subject<undefined>) => {
  if (subject.closed) { return }
  subject.next()
  subject.unsubscribe()
}

export interface IMseClientReadyEvent<TMseClient> {
  readonly mseClient: TMseClient
  readonly videoElement: HTMLVideoElement
}

@Directive({
  selector: 'video[floHls]'
})
export class HlsDirective<TMseClient, TMseMessage> implements OnDestroy, OnChanges, AfterViewInit {
  constructor(readonly el: ElementRef<HTMLVideoElement>,
    @Inject(SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION) private readonly _isMediaSourceSupported: boolean,
    @Inject(SUPPORTS_HLS_NATIVELY) private readonly _nativeSupportCheck: IVideoElementSupportsHlsCheck,
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK) private readonly _mseInitTask: IMseInitFunc<TMseClient, TMseMessage>,
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK) private readonly _mseSourceChangeTask: IMseSrcChangeFunc<TMseClient>,
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK) private readonly _mseDestroyTask: IMseDestroyFunc<TMseClient>
  ) { }

  private readonly _ngOnDestroy$ = new Subject<undefined>()
  private readonly _ngAfterViewInit$ = new Subject<undefined>()
  private readonly _hlsSrcChanges$ = new Subject<string>()
  private readonly _hlsMseClientSource$ = new Subject<TMseClient>()
  private readonly _hlsMseClientMessages$ = new Subject<TMseMessage>()
  public readonly videoElement = this.el.nativeElement

  @Input() public readonly floHls?: string
  @Output() public readonly hlsClient = this._hlsMseClientSource$.asObservable().pipe(takeUntil(this._ngOnDestroy$))
  @Output() public readonly hlsClientMessage = this._hlsMseClientMessages$.asObservable().pipe(takeUntil(this._ngOnDestroy$))
  // @Output() public readonly errors = this._errorSource$.asObservable().pipe(takeUntil(this._ngOnDestroy$))

  public ngAfterViewInit() {
    emitAndUnsubscribe(this._ngAfterViewInit$)
  }

  public ngOnDestroy() {
    emitAndUnsubscribe(this._ngOnDestroy$)
    this._mediaSourceClientPathSourceChangeSubscription.unsubscribe()
    this._nativeClientPathSubscription.unsubscribe()
    this._mseHlsClientPathInitSubscription.unsubscribe()
    this._destroyPlayerSubscription.unsubscribe()
  }

  public ngOnChanges(changes: SimpleChanges) {
    maybe(changes.floHls)
      .flatMap(a => a.currentValue === a.previousValue
        ? maybe<string>()
        : maybe<string>(a.currentValue))
      .tapSome(src => this._hlsSrcChanges$.next(src))
  }

  private readonly _mseHlsClientSupported$ = this._ngAfterViewInit$.pipe(
    filter(_ => this._isMediaSourceSupported)
  )

  private readonly _hlsClientNative$ = this._ngAfterViewInit$.pipe(
    filter(_ => !this._isMediaSourceSupported),
    filter(_ => this._nativeSupportCheck(this.videoElement))
  )

  private _nativeClientPathSubscription = combineLatest(
    this._hlsClientNative$,
    this._hlsSrcChanges$
  ).pipe(
    map(res => res[1]),
    takeUntil(this._ngOnDestroy$)
  ).subscribe(src => {
    this.videoElement.setAttribute('src', src)
  })


  private _mediaSourceClientPathSourceChangeSubscription = combineLatest(
    this._mseHlsClientSupported$,
    this._hlsSrcChanges$,
    this.hlsClient
  ).pipe(
    skip(1),
    map(res => ({ src: res[1], mseClient: res[2] })),
    takeUntil(this._ngOnDestroy$)
  ).subscribe(res => {
    this._mseSourceChangeTask({
      clientRef: res.mseClient,
      src: res.src,
      videoElement: this.videoElement
    })
  })

  private _mseHlsClientPathInitSubscription = combineLatest(this._mseHlsClientSupported$, this._hlsSrcChanges$)
    .pipe(map(res => res[1]), take(1))
    .subscribe(src => {
      const mseClient = this._mseInitTask({
        src,
        videoElement: this.videoElement,
        readyToPlayTriggerFn: () => undefined,
        messageSource: this._hlsMseClientMessages$
      })
      this._hlsMseClientSource$.next(mseClient)
    })

  private readonly _destroyPlayerSubscription = combineLatest(this.hlsClient, this._ngOnDestroy$)
    .pipe(take(1), map(a => a[0]))
    .subscribe(clientRef => this._mseDestroyTask({ clientRef, videoElement: this.videoElement }))
}
