import { Component, ChangeDetectionStrategy, Renderer2, Inject, OnInit, PLATFORM_ID, Input } from '@angular/core'
import { DOCUMENT, isPlatformBrowser } from '@angular/common'

declare const cast: any
declare const chrome: any

@Component({
  selector: 'flo-chromecast',
  template: `<google-cast-launcher></google-cast-launcher>`,
  styleUrls: ['ng-chromecast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloChromecastComponent implements OnInit {
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
    // tslint:disable-next-line:no-if-statement
    if (this.canRun() && !this.libAlreadyLoaded()) {
      this.createScriptElement()
    }
  }

  ngOnChanges(c) {

  }

  ngOnInit() {
    console.log(this.videoRef)
    // tslint:disable-next-line:no-object-mutation
    window['__onGCastApiAvailable'] = (isAvailable: boolean) => {
      // tslint:disable-next-line:no-if-statement
      if (isAvailable) {
        const castInstance = cast.framework.CastContext.getInstance()
        castInstance.setOptions({
          receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        })
        const sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID)
        const apiConfig = new chrome.cast.ApiConfig(sessionRequest,
          s => { console.log(s) },
          status => { console.log(status) }
        )
        chrome.cast.initialize(apiConfig,
          () => {
            console.log('GCast initialization success')
            // chrome.cast.requestSession(function (s) {
            //   console.log(s)
            // }, function (err) {
            //   console.log(err)
            // })


            // console.log(cast.framework.CastContext.getInstance().getCurrentSession())
          },
          err => console.log('GCast initialization failed', err))

        const remotePlayer = new cast.framework.RemotePlayer()
        const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer)
        remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
          () => {
            console.log('switch between remote and local?')
            const session = cast.framework.CastContext.getInstance().getCurrentSession()
            // tslint:disable-next-line:max-line-length
            const mediaInfo = new chrome.cast.media.MediaInfo('https://www.streambox.fr/playlists/x36xhzz/url_0/193039199_mp4_h264_aac_hd_7.m3u8')
            const request = new chrome.cast.media.LoadRequest(mediaInfo)
            session.loadMedia(request).then(
              function () { console.log('Load succeed') },
              function (errorCode) { console.log('Error code: ' + errorCode) })
          }
        )
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
