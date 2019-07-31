import {
  Directive, Input, ChangeDetectorRef,
  TemplateRef, ViewContainerRef, OnDestroy, OnInit, HostListener, ElementRef
} from '@angular/core'
import { FloMediaPlayerControlBaseDirective } from '../mp-base.directive'
import { fromEvent, combineLatest } from 'rxjs'
import { map, distinctUntilChanged, startWith, debounceTime, takeUntil, tap, mapTo, debounce, skip } from 'rxjs/operators'

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
export class FloMediaPlayerScrubberControlDirective<TMeta = any> extends FloMediaPlayerControlBaseDirective<TMeta> implements OnInit {
  constructor(private elmRef: ElementRef<HTMLInputElement>, private cd: ChangeDetectorRef) {
    super()
  }

  wasPaused: any

  private readonly setVideoTime = (vol: number) => {
    this.mediaElementRef.tapSome(ve => {
      ve.currentTime = +vol
      this.cd.markForCheck()
    })
  }

  @HostListener('change', ['$event'])
  change(evt: MouseEvent) {
    this.setVideoTime((evt.target as HTMLInputElement).valueAsNumber)
  }

  @HostListener('input', ['$event'])
  input(evt: MouseEvent) {
    this.setVideoTime((evt.target as HTMLInputElement).valueAsNumber)
  }

  ngOnInit() {
    this.elmRef.nativeElement.valueAsNumber = 0
    this.elmRef.nativeElement.step = `1`

    this.mediaElementRef.tapSome(v => {
      fromEvent(v, 'loadedmetadata').subscribe(s => {
        this.elmRef.nativeElement.max = v.duration.toString()
        this.cd.markForCheck()
      })

      const timeupdate = fromEvent(v, 'timeupdate').pipe(
        map(evt => (evt.target as HTMLMediaElement).currentTime),
        distinctUntilChanged()
      )

      timeupdate.pipe(
        // takeUntil(this.destroy$)
      ).subscribe(res => {
        this.elmRef.nativeElement.valueAsNumber = res
        this.cd.markForCheck()
      })
    })
  }
}
