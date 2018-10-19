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
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK, MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK, IMSEInitFunc, IMSEDestroyFunc
} from './hls.tokens'
import { filter, map, takeUntil, take, skip } from 'rxjs/operators'
import { Subject, combineLatest } from 'rxjs'
import { maybe } from 'typescript-monads'
import * as Hls from 'hls.js'

const emitAndUnsubscribe = (subject: Subject<undefined>) => {
  if (subject.closed) { return }
  subject.next()
  subject.unsubscribe()
}

// export interface HlsErrorEvent {
//   readonly MediaSourceClientError?: any // TODO
//   readonly NativeVideoError?: ErrorEvent
// }

@Directive({
  selector: 'video[floHls]'
})
export class HlsDirective<TMseClient, TMseMessage> implements OnDestroy, OnChanges, AfterViewInit {
  constructor(readonly el: ElementRef<HTMLVideoElement>,
    @Inject(SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION) private readonly _isMediaSourceSupported: boolean,
    @Inject(SUPPORTS_HLS_NATIVELY) private readonly _nativeSupportCheck: IVideoElementSupportsHlsCheck,
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK) private readonly _mseInitTask: IMSEInitFunc<TMseClient, TMseMessage>,
    @Inject(MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK) private readonly _mseDestroyTask: IMSEDestroyFunc<TMseClient>
  ) { }

  private readonly _ngOnDestroy$ = new Subject<undefined>()
  private readonly _ngAfterViewInit$ = new Subject<undefined>()
  private readonly _hlsSrcChanges$ = new Subject<string>()
  private readonly _hlsMseClientSource$ = new Subject<TMseClient>()
  private readonly _hlsMseClientMessages$ = new Subject<TMseMessage>()
  private readonly _readyToPlaySource$ = new Subject<HTMLVideoElement>()
  // private readonly _errorSource$ = new Subject<HlsErrorEvent>()
  private readonly sub = this._hlsMseClientMessages$.subscribe(console.log)
  public readonly videoElement = this.el.nativeElement

  @Input() public readonly floHls?: string
  // @Output() public readonly errors = this._errorSource$.asObservable().pipe(takeUntil(this._ngOnDestroy$))
  @Output() public readonly hlsClient = this._hlsMseClientSource$.asObservable().pipe(takeUntil(this._ngOnDestroy$))
  @Output() public readonly readyToPlay = this._readyToPlaySource$.asObservable().pipe(takeUntil(this._ngOnDestroy$))

  public ngAfterViewInit() {
    emitAndUnsubscribe(this._ngAfterViewInit$)
  }

  public ngOnDestroy() {
    emitAndUnsubscribe(this._ngOnDestroy$)
    this._nativeClientPathSubscription.unsubscribe()
    this._mediaSourceClientPathInitSubscription.unsubscribe()
    this._destroyPlayerSubscription.unsubscribe()
  }

  public ngOnChanges(changes: SimpleChanges) {
    maybe(changes.floHls)
      .flatMap(a => a.currentValue === a.previousValue
        ? maybe<string>()
        : maybe<string>(a.currentValue))
      .tapSome(src => {
        this._hlsSrcChanges$.next(src)
      })
  }

  private readonly _hlsClientSupported$ = this._ngAfterViewInit$.pipe(
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
    this.videoElement.addEventListener('loadedmetadata', () => this.loaderPlaySourceTrigger(), { passive: true })
    this.videoElement.addEventListener('error', err => { }, { passive: true })
    // attachNativeEventListeners(video)
  })

  loaderPlaySourceTrigger = () => {
    this._readyToPlaySource$.next(this.videoElement)
  }

  private _mediaSourceClientPathSourceChangeSubscription = combineLatest(
    this._hlsClientSupported$,
    this._hlsSrcChanges$,
    this.hlsClient
  ).pipe(
    skip(1),
    map(res => ({ src: res[1], mseClient: res[2] })),
    takeUntil(this._ngOnDestroy$)
  ).subscribe(res => {
    console.log('CHANGE SOURCE')
    this._mseDestroyTask({ clientRef: res.mseClient, videoElement: this.videoElement })
    const client = (res.mseClient as any)
    client.detachMedia()
    client.loadSource(res.src)
    client.attachMedia(this.videoElement)
    // this._mseInitTask({
    //   src: res.src,
    //   videoElement: this.videoElement,
    //   readyToPlayTriggerFn: this.loaderPlaySourceTrigger,
    //   messageSource: this._hlsMseClientMessages$
    // })
  })

  private _mediaSourceClientPathInitSubscription = combineLatest(
    this._hlsClientSupported$,
    this._hlsSrcChanges$
  )
    .pipe(map(res => res[1]), take(1))
    .subscribe(src => {
      console.log('INIT', src)
      const mseClient = this._mseInitTask({
        src,
        videoElement: this.videoElement,
        readyToPlayTriggerFn: this.loaderPlaySourceTrigger,
        messageSource: this._hlsMseClientMessages$
      })
      this._hlsMseClientSource$.next(mseClient)
    })

  private readonly _destroyPlayerSubscription = combineLatest(
    this.hlsClient,
    this._ngOnDestroy$
  ).pipe(take(1), map(a => a[0]))
    .subscribe(clientRef => {
      this._mseDestroyTask({ clientRef, videoElement: this.videoElement })
    })

  // private readonly hlsManifestParsed$ = this.hlsReady$.pipe(
  //   take(1),
  //   flatMapManifestParsed()
  // )

  // private readonly hlsLevelSwitched$ = this.hlsReady$.pipe(
  //   take(1),
  //   flatMapLevelSwitched(),
  //   distinctUntilChanged()
  // )

  // public readonly emitChangeResolution = combineLatest(
  //   this.hlsManifestParsed$,
  //   this.hlsLevelSwitched$
  // )
  //   .pipe(
  //     mapGetResolution(),
  //     filter(Boolean),
  //     distinctUntilChanged(),
  //     takeUntil(this.ngOnDestroy$)
  //   )
  //   .subscribe(resolution => this.changeResolution.next(resolution))

  // public readonly emitBufferCreated = this.hlsReady$
  //   .pipe(
  //     flatMapBufferCreated(),
  //     takeUntil(this.ngOnDestroy$)
  //   )
  //   .subscribe(([err, data]) => this.bufferCreated.next(data))

  // public readonly handleHlsError = this.hlsReady$
  //   .pipe(
  //     flatMapHlsErrors(),
  //     takeUntil(this.ngOnDestroy$)
  //   )
  // .subscribe(([errName, error]) => delegateErrorHandler(error, this.errors))
}

// export const fromHlsEvent = (hls: Hls, eventName: string | any) =>
//   fromEventPattern(
//     (callback: any) => hls.on(eventName, callback),
//     (callback: any) => hls.off(eventName, callback)
//   )
