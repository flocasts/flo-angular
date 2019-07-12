import { Component, ChangeDetectionStrategy, Renderer2, Inject, OnInit, PLATFORM_ID, Input, OnChanges } from '@angular/core'
import { DOCUMENT, isPlatformBrowser } from '@angular/common'

// tslint:disable: no-if-statement

declare const cast: any
declare const chrome: any

@Component({
  selector: 'flo-chromecast',
  template: `<google-cast-launcher></google-cast-launcher>`,
  styleUrls: ['./ng-chromecast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloChromecastComponent implements OnInit, OnChanges {
  @Input() public readonly videoRef: HTMLVideoElement
  constructor(private rd: Renderer2, @Inject(DOCUMENT) private doc: any, @Inject(PLATFORM_ID) private platformId: string) { }

  private readonly canRun = () => isPlatformBrowser(this.platformId)
  private readonly libAlreadyLoaded = () => this.doc.getElementById('chromecast-framework') ? true : false

  private readonly createScriptElement = () => {
    const scriptElement = this.rd.createElement('script') as HTMLScriptElement
    this.rd.setProperty(scriptElement, 'id', 'chromecast-framework')
    this.rd.setAttribute(scriptElement, 'type', 'text/javascript')
    this.rd.setAttribute(scriptElement, 'src', 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1')
    this.rd.appendChild(this.doc.body, scriptElement)
    return scriptElement
  }

  private readonly installLibraryIfRequired = () => {
    if (this.canRun() && !this.libAlreadyLoaded()) {
      this.createScriptElement()
    }
  }

  ngOnChanges(c) {
    // video reference could be swapped out here
  }

  ngOnInit() {
    console.log(this.videoRef)
    // tslint:disable-next-line:no-object-mutation
    window['__onGCastApiAvailable'] = (isAvailable: boolean) => {
      if (isAvailable) {
        const castInstance = cast.framework.CastContext.getInstance()
        castInstance.setOptions({
          receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        })
        const sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID)
        const apiConfig = new chrome.cast.ApiConfig(sessionRequest,
          s => { console.log('s', s) },
          status => { console.log('status', status) }
        )
        chrome.cast.initialize(apiConfig,
          () => {
            console.log('GCast initialization success')

            // THIS CAN BE BASED ON MANUALLY CLICK SETUP
            // chrome.cast.requestSession(function (s) {
            //   console.log(s)
            // }, function (err) {
            //   console.log(err)
            // })

            const remotePlayer = new cast.framework.RemotePlayer()
        const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer)
        remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
          () => {
            console.log('IS_CONNECTED_CHANGED')
            const session = cast.framework.CastContext.getInstance().getCurrentSession()

            console.log('SESSION', session)

            if (session) {
              // tslint:disable-next-line: max-line-length
              const mediaInfo = new chrome.cast.media.MediaInfo('https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8')
              const request = new chrome.cast.media.LoadRequest(mediaInfo)
              session.loadMedia(request).then(
                () => { console.log('Load succeed') },
                errorCode => { console.log('Session loadMedia Error', errorCode) })
            }
          }
        )

            // console.log(cast.framework.CastContext.getInstance().getCurrentSession())
          },
          err => console.log('GCast initialization failed', err))
      }
    }
    this.installLibraryIfRequired()
  }

  // launchMedia(media) {
  //   let mediaInfo = new this.cast.media.MediaInfo(media)
  //   let request = new this.cast.media.LoadRequest(mediaInfo)
  //   console.log('launch media with session', this.session)

  //   // if (!this.session) {
  //   //   window.open(media);
  //   //   return false;
  //   // }
  //   this.session.loadMedia(request, this.onMediaDiscovered.bind(this, 'loadMedia'), this.onMediaError);
  //   return true
  // }

  requestSession() {

  }
}
