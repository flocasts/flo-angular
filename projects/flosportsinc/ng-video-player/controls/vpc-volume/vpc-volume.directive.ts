import { FloMediaPlayerControlDirectiveBase } from '../vpc-base.directive'
import { Directive, HostListener, ElementRef, Inject, PLATFORM_ID, OnDestroy, OnChanges, SimpleChanges, Input } from '@angular/core'
import { Subject, fromEvent } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// tslint:disable: no-object-mutation
// tslint:disable: no-if-statement

@Directive({
  selector: 'input[type="range"][floVpc][floVpcVolume]'
})
export class FloMediaPlayerControlVolumeDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta>
  implements OnChanges, OnDestroy {
  constructor(private elmRef: ElementRef<HTMLInputElement>, @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  @Input() readonly min = '0'
  @Input() readonly max = '1'
  @Input() readonly step = '.01'

  private readonly ngOnDestroy$ = new Subject()
  private readonly ngOnChange$ = new Subject()

  private readonly setInputValue = (value: string) => this.elmRef.nativeElement.value = value
  private readonly getCurrentInputValue = () => +this.elmRef.nativeElement.value
  private readonly setVideoVolume = (vol: number) => this.maybeMediaElement().tapSome(ve => {
    if (ve.muted) {
      ve.volume = 0
      ve.muted = false
    } else {
      ve.volume = vol
    }
  })

  private readonly updateNativeAttributes = () => {
    this.elmRef.nativeElement.min = this.min
    this.elmRef.nativeElement.max = this.max
    this.elmRef.nativeElement.step = this.step
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.updateNativeAttributes()

    this.ngOnChange$.next()

    this.maybeMediaElement().tapSome(ve => {
      fromEvent(ve, 'volumechange').pipe(takeUntil(this.ngOnChange$))
        .subscribe(_ => {
          if (ve.muted) {
            this.setInputValue('0')
          } else {
            this.setInputValue('' + ve.volume)
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
    this.ngOnDestroy$.next()
    this.ngOnDestroy$.complete()
  }
}
