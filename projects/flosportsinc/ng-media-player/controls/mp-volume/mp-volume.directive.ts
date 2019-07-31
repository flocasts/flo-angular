import { FloMediaPlayerControlBaseDirective } from '../mp-base.directive'
import { Subject, fromEvent } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import {
  Directive, HostListener, ElementRef, OnDestroy, OnChanges, SimpleChanges, Input, ChangeDetectorRef
} from '@angular/core'

// tslint:disable: no-object-mutation
// tslint:disable: no-if-statement

@Directive({
  selector: 'input[type="range"][floMp][floMpVolume]'
})
export class FloMediaPlayerControlVolumeDirective<TMeta = any> extends FloMediaPlayerControlBaseDirective<TMeta>
  implements OnChanges, OnDestroy {
  constructor(private elmRef: ElementRef<HTMLInputElement>,
    private cd: ChangeDetectorRef) {
    super()
  }

  @Input() readonly min = '0'
  @Input() readonly max = '1'
  @Input() readonly step = '.01'

  private readonly ngOnChange$ = new Subject()

  private readonly setInputValue = (value: string) => this.elmRef.nativeElement.value = value
  private readonly getCurrentInputValue = () => +this.elmRef.nativeElement.value
  private readonly setVideoVolume = (vol: number) => {
    this.cd.detectChanges()
    this.mediaElementRef.tapSome(ve => {
      if (ve.muted) {
        ve.volume = 0
        ve.muted = false
      } else {
        ve.volume = vol
      }
    })
  }

  private readonly updateNativeAttributes = () => {
    this.elmRef.nativeElement.min = this.min
    this.elmRef.nativeElement.max = this.max
    this.elmRef.nativeElement.step = this.step
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.updateNativeAttributes()

    this.ngOnChange$.next()

    this.mediaElementRef.tapSome(ve => {
      fromEvent(ve, 'volumechange').pipe(takeUntil(this.ngOnChange$))
        .subscribe(_ => {
          if (ve.muted) {
            this.setInputValue('0')
          } else {
            this.setInputValue(`${ve.volume}`)
          }
        })
    })
  }

  @HostListener('change')
  change() {
    this.setVideoVolume(this.getCurrentInputValue())
  }

  @HostListener('input')
  input() {
    this.setVideoVolume(this.getCurrentInputValue())
  }

  ngOnDestroy() {
    this.ngOnChange$.complete()
  }
}
