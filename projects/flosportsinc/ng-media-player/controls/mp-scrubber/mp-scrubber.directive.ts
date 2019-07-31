import { Directive, ChangeDetectorRef, OnDestroy, HostListener, ElementRef, SimpleChanges, OnChanges } from '@angular/core'
import { FloMediaPlayerControlBaseDirective } from '../mp-base.directive'
import { map, takeUntil, startWith, tap, debounceTime } from 'rxjs/operators'
import { fromEvent, Subject, of, merge } from 'rxjs'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

export enum FloMediaDurationViewMode {
  FULL,
  SLIM,
  TIME_REMAINING
}

@Directive({
  selector: 'input[type="range"][floMp][floMpScrubber]'
})
export class FloMediaPlayerScrubberControlDirective<TMeta = any> extends FloMediaPlayerControlBaseDirective<TMeta>
  implements OnChanges, OnDestroy {
  constructor(private elmRef: ElementRef<HTMLInputElement>, private cd: ChangeDetectorRef) {
    super()
  }

  private readonly setVideoTime = (vol: number) => {
    this.mediaElementRef.tapSome(ve => {
      ve.currentTime = +vol
      this.cd.markForCheck()
    })
  }

  private changes = new Subject()
  private changes$ = this.changes.asObservable()

  get inputElement() {
    return this.elmRef.nativeElement
  }

  @HostListener('change', ['$event'])
  change(evt: MouseEvent) {
    this.setVideoTime((evt.target as HTMLInputElement).valueAsNumber)
  }

  @HostListener('input', ['$event'])
  input(evt: MouseEvent) {
    this.setVideoTime((evt.target as HTMLInputElement).valueAsNumber)
  }

  ngOnChanges(sc: SimpleChanges) {
    if (!sc.mediaElementRef) { return }

    this.changes.next()
    this.inputElement.step = `1`

    this.mediaElementRef.tapSome(media => {
      this.cd.markForCheck()
      const duration$ = (media.readyState >= 1
        ? of(media.duration)
        : fromEvent(media, 'loadedmetadata').pipe(map(evt => (evt.target as HTMLMediaElement).duration))).pipe(
          map(Math.ceil),
          map(a => a - 1),
          tap(duration => this.inputElement.max = duration.toString()))

      const timeupdate$ = fromEvent(media, 'timeupdate').pipe(
        map(evt => (evt.target as HTMLMediaElement).currentTime),
        startWith(media.currentTime),
        map(Math.ceil),
        debounceTime(0),
        tap(res => {
          this.inputElement.valueAsNumber = res
        }))

      merge(timeupdate$, duration$).pipe(takeUntil(this.changes$)).subscribe(() => {
        this.cd.markForCheck()
      })
    })
  }

  ngOnDestroy() {
    this.changes.next()
    this.changes.complete()
  }
}
