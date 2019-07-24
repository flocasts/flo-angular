import { Directive, Input, Inject, ChangeDetectorRef, PLATFORM_ID, ElementRef } from '@angular/core'
import { FloMediaPlayerControlDirectiveBase } from '../mp-base.directive'
import { fromEvent } from 'rxjs'
import { isPlatformServer } from '@angular/common'

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

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    if (isPlatformServer(this.platformId)) { return }
    if (this.mediaRef) {
      fromEvent(this.mediaRef, 'durationchange').subscribe(evt => {
        const media = evt.target as HTMLMediaElement
        const secondsInt = parseInt('' + media.duration, 10)
        const hours = Math.floor(secondsInt / 3600)
        const minutes = Math.floor(secondsInt / 60) % 60
        const seconds = secondsInt % 60
        const z = [hours, minutes, seconds]
          .map(v => v < 10 ? '0' + v : v)
          .filter((v, i) => v !== '00' || i > 0)
          .join(':')
      })
    }
  }
}
