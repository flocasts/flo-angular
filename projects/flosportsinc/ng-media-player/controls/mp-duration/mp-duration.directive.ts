import {
  Directive, Input, Inject, ChangeDetectorRef, PLATFORM_ID,
  TemplateRef, ViewContainerRef, OnDestroy, OnInit
} from '@angular/core'
import { FloMediaPlayerControlDirectiveBase } from '../mp-base.directive'
import { fromEvent, combineLatest, Subject, BehaviorSubject } from 'rxjs'
import { map, distinctUntilChanged, takeUntil, tap, startWith, debounceTime } from 'rxjs/operators'
import { isPlatformServer } from '@angular/common'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

export enum FloMediaDurationViewMode {
  FULL,
  SLIM,
  TIME_REMAINING
}

@Directive({
  selector: '[floMpDuration]'
})
export class FloMediaPlayerDurationControlDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> implements
  OnInit, OnDestroy {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _floMpDuration?: HTMLMediaElement

  @Input('floMpDurationOf')
  get mediaRef() {
    return this._floMpDuration
  }
  set mediaRef(val: HTMLMediaElement | undefined) {
    this._floMpDuration = val
  }

  @Input() durationSeconds = 1200

  private formatdate = (secondsInt: number) => {
    const hours = Math.floor(secondsInt / 3600)
    const minutes = Math.floor(secondsInt / 60) % 60
    const seconds = secondsInt % 60
    return {
      hours,
      minutes,
      seconds,
      formatted: [hours, minutes, seconds]
        .map(v => v < 10 ? '0' + v : v)
        .filter((v, i) => v !== '00' || i > 0)
        .join(':')
    }
  }

  private destroy$ = new Subject()
  private modeSource = new BehaviorSubject<FloMediaDurationViewMode>(FloMediaDurationViewMode.FULL)
  private displayMode$ = this.modeSource.asObservable()
  private context = {
    $implicit: {
      current: this.formatdate(0),
      remaining: this.formatdate(this.durationSeconds),
      duration: this.formatdate(this.durationSeconds)
    }
  }

  nextViewMode() {
    const enumKeys = Object.values(FloMediaDurationViewMode).filter(a => typeof a === 'number')
    const currentEnum = enumKeys.indexOf(this.modeSource.getValue())

    if (currentEnum < 0 || currentEnum >= enumKeys.length - 1) {
      this.modeSource.next(0)
    } else {
      this.modeSource.next(currentEnum + 1)
    }
  }

  ngOnInit() {
    // if (isPlatformServer(this.platformId)) { return }

    if (this.mediaRef) {
      const viewRef = this.vc.createEmbeddedView(this.tr, this.context)
      const rootNode = viewRef.rootNodes[0] as HTMLElement
      rootNode.addEventListener('click', () => this.nextViewMode())

      const timeupdate = fromEvent(this.mediaRef, 'timeupdate').pipe(
        map(evt => Math.floor((evt.target as HTMLMediaElement).currentTime)),
        distinctUntilChanged(),
        startWith(0) // TODO: or some start time defined earlier
      )
      const durationchange = fromEvent(this.mediaRef, 'durationchange').pipe(
        map(evt => parseInt('' + (evt.target as HTMLMediaElement).duration, 10))
      )

      combineLatest(timeupdate, durationchange, this.displayMode$).pipe(
        debounceTime(30),
        map(res => {
          return {
            mode: res[2],
            current: this.formatdate(res[0]),
            duration: this.formatdate(res[1]),
            remaining: this.formatdate(res[1] - res[0])
          }
        }),
        takeUntil(this.destroy$)
      ).subscribe(res => {
        this.context.$implicit = res
        this.cd.markForCheck()
      })
    }
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
