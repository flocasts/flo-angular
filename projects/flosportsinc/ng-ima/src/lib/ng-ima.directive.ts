import { Directive, ElementRef, Input, Renderer2, OnInit, OnDestroy, ApplicationRef } from '@angular/core'
import { share, map, filter, tap, takeUntil, startWith, take, shareReplay, flatMap, throttleTime } from 'rxjs/operators'
import { Subject, fromEvent, combineLatest, EMPTY, fromEventPattern } from 'rxjs'

declare const google: any

// check autoplay works with audio
// check if a muted autoplay works
// render button to start playback
@Directive({
  selector: 'video[floIma]'
})
export class FloImaDirective implements OnInit, OnDestroy {
  constructor(public elementRef: ElementRef<HTMLVideoElement>, private rd: Renderer2, private appRef: ApplicationRef) { }

  @Input() public readonly floIma?: any

  private readonly originalSrc = this.elementRef.nativeElement.src
  private readonly adLibIsLoaded = () => typeof google !== 'undefined' && typeof google.ima !== 'undefined'
  private readonly videoElement = this.elementRef.nativeElement
  private readonly onInitSource = new Subject()
  private readonly canAutoplaySource = new Subject()
  private readonly onDestroySource = new Subject()
  private readonly onInit = this.onInitSource.pipe(take(1), share())
  private readonly onDestroy = this.onDestroySource.pipe(share())
  private readonly canAutoplay = this.canAutoplaySource.pipe(take(1), share())

  /** The <div> element reference created above the <video> element this directive is assigned to. */
  private readonly adContainerElement = combineLatest(this.canAutoplay, this.onInit).pipe(
    filter(() => this.adLibIsLoaded()),
    map(() => {
      console.log('CREATING AD CONTAINER')
      return this.createAdContainerElement()
    }),
    shareReplay(1)
  )

  /** Google's container element that contains the iframe and video element. */
  private readonly adDisplayContainer = this.adContainerElement.pipe(
    map(containerElement => new google.ima.AdDisplayContainer(containerElement, this.videoElement)),
    tap(adDisplayContainer => {
      console.log('ASDASD')
      this.elementRef.nativeElement.load()
      adDisplayContainer.initialize()
    })
  )

  /** Google's container element that contains the iframe and video element. */
  private readonly adLoader = this.adDisplayContainer.pipe(
    map(displayContainer => new google.ima.AdsLoader(displayContainer))
  )

  /** Google's ad manager */
  private readonly adManager = this.adLoader.pipe(
    tap(adLoader => {
      const adsRequest = new google.ima.AdsRequest()
      // tslint:disable-next-line:no-object-mutation
      adsRequest.adTagUrl = this.floIma
      adsRequest.setAdWillAutoPlay(true) // TODO: determine what we can do!
      adsRequest.setAdWillPlayMuted(true) // TODO: determine what we can do!
      adLoader.requestAds(adsRequest)
    }),
    flatMap(adLoader => fromEventPattern(
      addHandler => adLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, addHandler, true),
      removeHandler => adLoader.removeEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, removeHandler, true)
    )),
    map((evt: any) => evt.getAdsManager(this.videoElement)),
    shareReplay(1)
  )

  private readonly createAdContainerElement = () => {
    const adContainerElement = this.rd.createElement('div') as HTMLDivElement
    // tslint:disable:no-object-mutation
    adContainerElement.style.position = 'absolute'
    adContainerElement.style.zIndex = '100'
    const parentContainer = this.rd.parentNode(this.videoElement)
    this.rd.insertBefore(parentContainer, adContainerElement, this.videoElement)
    return adContainerElement
  }

  // replace this with autoplay directive package
  ngAfterViewInit() {
    if (!this.adLibIsLoaded()) return;
    fromEvent(this.elementRef.nativeElement, 'loadstart').pipe(
      take(1),
      map(e => e.target as HTMLVideoElement))
      .subscribe(ve => {
        ve.play()
          .catch(() => {
            ve.muted = true
            ve.volume = 0
            ve.pause()
            this.canAutoplaySource.next()
          }).then(() => {
            ve.pause()
            this.canAutoplaySource.next()
          })
      })
  }

  ngOnInit() {

    this.adManager.subscribe(adManager => {
      try {
        adManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, () => {
          this.videoElement.play()
          adManager.destroy()
        })
        adManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, console.log)
        adManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, () => {
          adManager.destroy()
          this.videoElement.src = this.originalSrc
          this.videoElement.play()
        })

        adManager.init(this.videoElement.clientWidth, this.videoElement.clientHeight, google.ima.ViewMode.NORMAL)
        adManager.start()
      } catch (adError) {
        console.log(adError)
        this.videoElement.play()
      }
    })

    this.onInitSource.next()
    this.onInitSource.complete()

    const isStable = this.appRef.isStable.pipe(take(1))
    const resize = fromEvent(window, 'resize').pipe(startWith(EMPTY))

    combineLatest(isStable, resize, this.adManager, this.adContainerElement).pipe(
      throttleTime(30),
      takeUntil(this.onDestroy)
    ).subscribe(([_stable, _win, adManager, adContainerElement]) => {
      console.log(this.videoElement.clientWidth) // TODO: fix for safari
      window.scroll(0, 1)
      adContainerElement.style.width = `${this.videoElement.clientWidth}px`
      adContainerElement.style.height = `${this.videoElement.clientHeight}px`
      adManager.resize(this.videoElement.clientWidth, this.videoElement.clientHeight, google.ima.ViewMode.NORMAL)
    })
  }

  ngOnDestroy() {
    this.onDestroySource.next()
    this.onDestroySource.complete()
  }
}
