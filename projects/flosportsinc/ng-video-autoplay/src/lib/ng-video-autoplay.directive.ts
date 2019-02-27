import { Directive, ElementRef, Input, Renderer2, OnDestroy, OnInit } from '@angular/core'
import { fromEvent, Subject, from, Observable } from 'rxjs'
import { share, takeUntil, map, flatMap, filter, tap } from 'rxjs/operators'
import { maybe } from 'typescript-monads'

interface VideoHaltStatus {
  readonly videoElement: HTMLVideoElement
  readonly halted: boolean
}

// tslint:disable:no-object-mutation
const filterHalted =
  (source: Observable<VideoHaltStatus>) =>
    source.pipe(filter(res => res.halted === true))

const tryPlayVideoAsIs =
  (source: Observable<HTMLVideoElement>) =>
    source.pipe(flatMap(ve => ve.play().then(() => {
      return {
        halted: false,
        videoElement: ve
      }
    }).catch(() => {
      return {
        halted: true,
        videoElement: ve
      }
    })), filterHalted)

const tryPlayVideoMuted =
  (source: Observable<VideoHaltStatus>) =>
    source.pipe(map(res => {
      res.videoElement.muted = true
      res.videoElement.volume = 0
      return res.videoElement
    }), tryPlayVideoAsIs)

// 1) attempt to play as-is (including autoplay + unmuted)
// 2) attempt to play muted
// 3) show click to play
@Directive({
  selector: 'video[floAutoplay]'
})
export class VideoAutoplayDirective implements OnInit, OnDestroy {
  @Input() public readonly floAutoplay?: HTMLElement

  private readonly onDestroySource = new Subject()
  private readonly onDestroy = this.onDestroySource.pipe(share())
  private readonly videoElement = this.elmRef.nativeElement
  private readonly maybeActionButton = () => maybe(this.floAutoplay)

  constructor(private elmRef: ElementRef<HTMLVideoElement>, private rd: Renderer2) {
    this.videoElement.setAttribute('autoplay', 'true')

    fromEvent(this.videoElement, 'loadstart').pipe(
      map(evt => evt.target as HTMLVideoElement),
      tryPlayVideoAsIs,
      tap(() => {
        this.maybeActionButton().tapSome(btn => {
          this.rd.setStyle(btn, 'display', 'block')
          fromEvent(btn, 'click').subscribe(() => {
            this.videoElement.muted = false
            this.videoElement.volume = 1
            this.videoElement.play()
            this.rd.setStyle(btn, 'display', 'none')
          })
        })
      }),
      tryPlayVideoMuted,
      takeUntil(this.onDestroy)
    ).subscribe(d => {
      // if we got here, we were stopped from autoplaying with volume
      console.log(d)
    })
  }

  ngOnInit() {
    this.maybeActionButton().tapSome(btn => {
      this.rd.setStyle(btn, 'display', 'none')
    })
  }

  ngOnDestroy() {
    this.onDestroySource.next()
    this.onDestroySource.complete()
  }
}
