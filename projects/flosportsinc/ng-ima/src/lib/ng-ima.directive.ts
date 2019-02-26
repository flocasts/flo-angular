import { Directive, ElementRef, Input, Renderer2, ChangeDetectorRef, OnInit, OnDestroy, ApplicationRef } from '@angular/core'
import { share, map, filter, tap, throttleTime, takeUntil, startWith, take, shareReplay, flatMap } from 'rxjs/operators'
import { Subject, fromEvent, combineLatest, ReplaySubject, EMPTY, fromEventPattern } from 'rxjs'

declare const google: any

@Directive({
  selector: 'video[floIma]'
})
export class FloImaDirective implements OnInit, OnDestroy {
  constructor(public elementRef: ElementRef<HTMLVideoElement>, private rd: Renderer2, private appRef: ApplicationRef) { }

  private readonly adLibIsLoaded = () => typeof google !== 'undefined' && typeof google.ima !== 'undefined'
  private readonly videoElement = this.elementRef.nativeElement
  private readonly onInitSource = new Subject()
  private readonly onDestroySource = new Subject()
  private readonly onInit = this.onInitSource.pipe(share())
  private readonly onDestroy = this.onDestroySource.pipe(share())

  /** The <div> element reference created above the <video> element this directive is assigned to. */
  private readonly adContainerElement = this.onInit.pipe(
    filter(() => this.adLibIsLoaded()),
    map(() => this.createAdContainerElement()),
    shareReplay(1)
  )

  /** Google's container element that contains the iframe and video element. */
  private readonly adDisplayContainer = this.adContainerElement.pipe(
    map(containerElement => new google.ima.AdDisplayContainer(containerElement, this.videoElement)),
    tap(adDisplayContainer => adDisplayContainer.initialize()),
  )

  /** Google's container element that contains the iframe and video element. */
  private readonly adLoader = this.adDisplayContainer.pipe(
    map(displayContainer => new google.ima.AdsLoader(displayContainer))
  )

  private readonly adManager = this.adLoader.pipe(
    tap(adLoader => {
      const adsRequest = new google.ima.AdsRequest()
      // tslint:disable:max-line-length
      // tslint:disable-next-line:no-object-mutation
      adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator='
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

  ngOnInit() {
    this.adManager.subscribe(adManager => {
      try {
        console.log('INITTING')
        window.scroll(0, 1)
        adManager.init(this.videoElement.clientWidth, this.videoElement.clientHeight, google.ima.ViewMode.NORMAL)
        adManager.start()
      } catch (adError) {
        console.log(adError)
        adManager.play()
      }
    })
    // this.adLoader.subscribe(adsLoader => {
    //   adsLoader.addEventListener(
    //     google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
    //     (a) => {
    //       const adsManager = a.getAdsManager(this.videoElement)
    //       console.log(adsManager)
    //       adsManager.addEventListener(
    //         google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
    //         () => {
    //           // this.videoElement.removeEventListener('ended', contentEndedListener)
    //           this.videoElement.pause()
    //         })
    //       try {
    //         adsManager.init(this.videoElement.clientWidth, this.videoElement.clientHeight, google.ima.ViewMode.NORMAL)
    //         adsManager.start()
    //       } catch (adError) {
    //         // console.log(adError)
    //         adsManager.play()
    //       }
    //     }, false)
    // })
    this.onInitSource.next()
    this.onInitSource.complete()

    const isStable = this.appRef.isStable.pipe(take(1))
    const resize = fromEvent(window, 'resize').pipe(startWith(EMPTY))
    const load = fromEvent(window, 'load').pipe(take(1))


    combineLatest(isStable, resize, this.adManager, this.adContainerElement).pipe(
      // throttleTime(60),
      takeUntil(this.onDestroy)
    ).subscribe(([_stable, _win, adManager, adContainerElement]) => {
      adContainerElement.style.width = `${this.videoElement.clientWidth}px`
      adContainerElement.style.height = `${this.videoElement.clientHeight}px`
      adManager.resize(this.videoElement.clientWidth, this.videoElement.clientHeight, google.ima.ViewMode.NORMAL)
    })
  }

  ngOnDestroy() {
    this.onDestroySource.next()
    this.onDestroySource.complete()
  }

  @Input() public readonly floIma?: any
}
