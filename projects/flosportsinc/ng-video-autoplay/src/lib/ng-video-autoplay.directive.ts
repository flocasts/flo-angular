import { Directive, ElementRef, Input, Renderer2, OnDestroy, OnInit } from '@angular/core'
import { share, takeUntil, map, flatMap, filter, tap, shareReplay } from 'rxjs/operators'
import { fromEvent, Subject, Observable } from 'rxjs'
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
    source.pipe(flatMap(videoElement => videoElement.play()
      .then(() => ({ videoElement, halted: false }))
      .catch(() => ({ videoElement, halted: true }))
    ), filterHalted)

const tryPlayVideoMuted =
  (source: Observable<VideoHaltStatus>) =>
    source.pipe(map(res => {
      res.videoElement.muted = true
      res.videoElement.volume = 0
      return res.videoElement
    }), tryPlayVideoAsIs)

// 1) attempt to play as-is (including autoplay + unmuted)
// 2) attempt to play muted, showing unmite button
// 3) show click to play
@Directive({
  selector: 'video[floVideoAutoplay]'
})
export class FloVideoAutoplayDirective implements OnInit, OnDestroy {
  @Input() public readonly floVideoAutoplay?: HTMLElement

  private readonly onDestroySource = new Subject()
  private readonly onDestroy = this.onDestroySource.pipe(share())
  private readonly videoElement = this.elmRef.nativeElement
  private readonly maybeActionRef = () => maybe(this.floVideoAutoplay).filter(a => a as any !== '')

  private readonly hideRef = (ref: HTMLElement) => {
    this.rd.setStyle(ref, 'display', 'none')
  }

  private readonly showRef = (ref: HTMLElement) => {
    this.rd.setStyle(ref, 'display', 'block')
  }

  private readonly volumeChange = fromEvent(this.videoElement, 'volumechange', { passive: true }).pipe(
    map(evt => evt.target as HTMLVideoElement),
    share(),
    takeUntil(this.onDestroy))

  constructor(private elmRef: ElementRef<HTMLVideoElement>, private rd: Renderer2) {
    this.videoElement.setAttribute('autoplay', 'true')

    this.volumeChange.pipe(filter(v => !v.muted || v.volume > 0)).subscribe(() => this.maybeActionRef().tapSome(this.hideRef))
    this.volumeChange.pipe(filter(v => v.muted || v.volume <= 0)).subscribe(() => this.maybeActionRef().tapSome(this.showRef))

    fromEvent(this.videoElement, 'loadstart').pipe(
      map(evt => evt.target as HTMLVideoElement),
      tryPlayVideoAsIs,
      tryPlayVideoMuted,
      takeUntil(this.onDestroy)
    ).subscribe()
    // TODO: if we got here, we were stopped from autoplaying with volume
  }

  ngOnInit() {
    this.maybeActionRef().tapSome(this.hideRef)
    this.maybeActionRef().tapSome(ref => {
      fromEvent(ref, 'click').pipe(takeUntil(this.onDestroy)).subscribe(() => {
        this.videoElement.muted = false
        this.videoElement.volume = 1
      })
    })
  }

  ngOnDestroy() {
    this.onDestroySource.next()
    this.onDestroySource.complete()
  }
}
