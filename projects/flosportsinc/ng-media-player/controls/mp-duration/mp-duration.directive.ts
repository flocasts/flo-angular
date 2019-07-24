import { Directive, Input, Inject, ChangeDetectorRef, PLATFORM_ID, ElementRef } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase } from '../mp-base.directive'
import { fromEvent, combineLatest } from 'rxjs'
import { isPlatformServer } from '@angular/common'
import { map, distinctUntilChanged } from 'rxjs/operators'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Directive({
  selector: '[floMpDuration]'
})
export class FloMediaPlayerDurationControlDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta> {
  constructor(private cd: ChangeDetectorRef, private elmRef: ElementRef<HTMLElement>, @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private _floMpDuration?: HTMLMediaElement

  @Input('floMpDuration')
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

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    if (isPlatformServer(this.platformId)) { return }

    if (this.mediaRef) {
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
            duratiion: this.formatdate(res[1])
          }
        })
      ).subscribe(res => {
        console.log(res)
      })
    }
  }
}
