import {
  Directive, Input, Inject, ChangeDetectorRef, PLATFORM_ID,
  ElementRef, TemplateRef, ViewContainerRef, OnDestroy, OnInit
} from '@angular/core'
import { FloMediaPlayerControlDirectiveBase } from '../mp-base.directive'
import { fromEvent, combineLatest, Subject, interval } from 'rxjs'
import { map, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators'
import { isPlatformServer } from '@angular/common'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

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
  private context = { $implicit: { current: this.formatdate(0), duration: this.formatdate(0) } }

  ngOnInit() {
    // if (isPlatformServer(this.platformId)) { return }

    if (this.mediaRef) {
      this.vc.createEmbeddedView(this.tr, this.context)

      const timeupdate = fromEvent(this.mediaRef, 'timeupdate').pipe(
        map(evt => Math.floor((evt.target as HTMLMediaElement).currentTime)),
        distinctUntilChanged()
      )
      const durationchange = fromEvent(this.mediaRef, 'durationchange').pipe(
        map(evt => parseInt('' + (evt.target as HTMLMediaElement).duration, 10))
      )

      combineLatest(timeupdate, durationchange).pipe(
        map(res => {
          return {
            current: this.formatdate(res[0]),
            duration: this.formatdate(res[1])
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
