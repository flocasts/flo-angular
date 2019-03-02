import { Directive, ElementRef, Input, Renderer2, OnDestroy, AfterContentInit, ContentChildren, QueryList } from '@angular/core'
import { share, takeUntil, map, flatMap, filter, tap, take } from 'rxjs/operators'
import { fromEvent, Subject, Observable } from 'rxjs'
import { maybe, either } from 'typescript-monads'

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
  selector: '[floVideoAutoplay]'
})
export class FloVideoAutoplayDirective implements AfterContentInit, OnDestroy {
  @Input() public readonly floVideoAutoplay?: HTMLElement
  @Input() public readonly floVideoAutoplayIndex = 0

  @ContentChildren('floVideoAutoplay', { descendants: true }) public readonly videos: QueryList<ElementRef<HTMLVideoElement>>

  private readonly onDestroySource = new Subject()
  private readonly onDestroy = this.onDestroySource.pipe(share())
  private readonly maybeVideoElement = () => maybe(this.elmRef.nativeElement).filter(e => e.nodeName === 'VIDEO')
  private readonly maybeActionRef = () => maybe(this.floVideoAutoplay).filter(a => a as any !== '')

  private readonly hideRef = (ref: HTMLElement) => {
    this.rd.setStyle(ref, 'display', 'none')
  }

  private readonly showRef = (ref: HTMLElement) => {
    this.rd.setStyle(ref, 'display', 'block')
  }

  private readonly volumeChange = (videoElement: HTMLVideoElement) =>
    fromEvent(videoElement, 'volumechange', { passive: true }).pipe(
      map(evt => evt.target as HTMLVideoElement),
      share(),
      takeUntil(this.onDestroy))

  private readonly initOnVideo = (videoElement: HTMLVideoElement) =>
    fromEvent(videoElement, 'loadstart').pipe(
      tap(() => videoElement.setAttribute('autoplay', 'true')),
      map(evt => evt.target as HTMLVideoElement),
      tryPlayVideoAsIs,
      tryPlayVideoMuted,
      takeUntil(this.onDestroy)
    ).subscribe()

  constructor(private elmRef: ElementRef<HTMLVideoElement>, private rd: Renderer2) { }

  private readonly runSequence = (actionRef: HTMLElement) => (runOnce = false) => (videoElement: HTMLVideoElement) => {
    videoElement.setAttribute('autoplay', 'true')
    fromEvent(actionRef, 'click').pipe(takeUntil(this.onDestroy)).subscribe(() => {
      videoElement.muted = false
      videoElement.volume = 1
    })

    this.volumeChange(videoElement).pipe(filter(v => !v.muted || v.volume > 0)).subscribe(() => this.hideRef(actionRef))
    const showRef = this.volumeChange(videoElement).pipe(filter(v => v.muted || v.volume <= 0));
    (runOnce ? showRef.pipe(take(1)) : showRef).subscribe(() => this.showRef(actionRef))
  }

  ngAfterContentInit() {
    this.maybeVideoElement().tapSome(this.initOnVideo)
    this.videos.map(a => a.nativeElement).forEach(this.initOnVideo)

    this.maybeActionRef().tapSome(ref => {
      this.hideRef(ref)

      either(this.maybeVideoElement().valueOrUndefined(),
        maybe(this.videos.toArray()[this.floVideoAutoplayIndex]).map(a => a.nativeElement).valueOrUndefined())
        .tap({
          left: this.runSequence(ref)(false),
          right: this.runSequence(ref)(true)
        })
    })
  }

  ngOnDestroy() {
    this.onDestroySource.next()
    this.onDestroySource.complete()
  }
}
