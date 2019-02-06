import { Directive, ElementRef, Renderer2, ApplicationRef, ChangeDetectorRef } from '@angular/core'
import { timeInterval, throttleTime } from 'rxjs/operators'
import { fromEvent } from 'rxjs'

@Directive({
  selector: 'video[floIma]'
})
export class FloImaDirective {
  constructor(private elmRef: ElementRef, private rd: Renderer2, private cd: ChangeDetectorRef) {


  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    const videoElement = this.elmRef.nativeElement as HTMLVideoElement
    this.rd.setStyle(videoElement, 'width', '100%')
    this.rd.setStyle(videoElement, 'height', 'auto')
    // tslint:disable:no-object-mutation

    const adDisplayContainerElement = this.rd.createElement('div') as HTMLDivElement
    // tslint:disable-next-line:no-object-mutation
    // adDisplayContainerElement.style.width = videoElement.width || ''
    this.rd.insertBefore(this.rd.parentNode(this.elmRef.nativeElement), adDisplayContainerElement, videoElement)
    const adDisplayContainer = new google.ima.AdDisplayContainer(adDisplayContainerElement, this.elmRef.nativeElement)
    const adsLoader = new google.ima.AdsLoader(adDisplayContainer)

    // adDisplayContainer.setSize(videoElement.clientWidth, videoElement.clientHeight)
    adDisplayContainer.initialize()

    fromEvent(window, 'resize')
      .pipe(throttleTime(60))
      .subscribe(() => {
        // console.log('RESIZED')
        // console.log(videoElement.clientWidth, videoElement.clientHeight)
        adDisplayContainer.setSize(videoElement.clientWidth, videoElement.clientHeight)
      })

    const adsRequest = new google.ima.AdsRequest()
    // tslint:disable-next-line:no-object-mutation
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
      'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
      'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
      'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator='

    // tslint:disable:no-object-mutation
    // adsRequest.linearAdSlotWidth = 640
    // adsRequest.linearAdSlotHeight = 400
    // adsRequest.nonLinearAdSlotWidth = 640
    // adsRequest.nonLinearAdSlotHeight = 150

    adsLoader.requestAds(adsRequest)

    adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (a) => {
        // Get the ads manager.
        const adsManager = a.getAdsManager(videoElement)  // See API reference for contentPlayback
        // Add listeners to the required events.
        // adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, console.log)
        // adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, console.log)
        // adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, console.log)

        try {

          // Initialize the ads manager. Ad rules playlist will start at this time.
          // const width = getComputedStyle(videoElement).width
          // const height = getComputedStyle(videoElement).height
          // setTimeout(() => {
          // console.log(width, height)
          // })
          const evt = document.createEvent('UIEvents')
          evt.initUIEvent('resize', true, false, window, 0)
          window.dispatchEvent(evt)
          this.cd.detectChanges()
          console.log(videoElement.clientWidth)
          adsManager.init(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL)
          // window.dispatchEvent(new Event('resize'))
          adsManager.start()

          // tslint:disable:no-var-keyword
          // setTimeout(() => {
          //   const z = adDisplayContainerElement.firstElementChild as HTMLDivElement
          //   z.style.width = videoElement.clientWidth.toString()

          //   adDisplayContainer.setSize(videoElement.clientWidth, videoElement.clientHeight)
          //   adDisplayContainerElement.style.webkitTransform = 'scale(1)'
          // }, 50)


        } catch (adError) {
          console.log(adError)
          // An error may be thrown if there was a problem with the VAST response.
          // Play content here, because we won't be getting an ad.
          videoElement.play()
        }
      }, false)

    // adsLoader.addEventListener(
    //   google.ima.AdErrorEvent.Type.AD_ERROR,
    //   console.log,
    //   false)
    // const contentEndedListener = function () { adsLoader.contentComplete() }
    // videoElement.addEventListener('loadend', contentEndedListener)

    // adsLoader.contentComplete()
    // Request video ads.

    // this.rd.insertBefore()
    // console.log(document.getElementById('adContainer'))
    // const adDisplayContainer =
    //   new google.ima.AdDisplayContainer(document.getElementById('adContainer'), this.elementRef.nativeElement)
    // // Must be done as the result of a user action on mobile
    // adDisplayContainer.initialize()
    // const adsLoader = new google.ima.AdsLoader(adDisplayContainer)
    // const adsRequest = new google.ima.AdsRequest()
    // // tslint:disable-next-line:no-object-mutation
    // adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
    //   'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
    //   'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
    //   'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator='
    // adsRequest.requestAds(adsRequest)

    // this.elementRef.nativeElement.addEventListener('play', requestAds)

    // function requestAds() {
    //   adsLoader.requestAds(adsRequest);
    // }

  }
}
