import { FloVideoPlayerControlDirectiveBase } from '../vpc-base.directive'
import { Directive, HostListener, ElementRef, Inject, PLATFORM_ID, OnDestroy, OnChanges, SimpleChanges } from '@angular/core'
import { Subject, fromEvent } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// tslint:disable: no-object-mutation
// tslint:disable: no-if-statement

@Directive({
  selector: 'input[type="range"][floVpc][floVpcVolume]'
})
export class FloVideoPlayerControlVolumeDirective<TMeta = any> extends FloVideoPlayerControlDirectiveBase<TMeta>
  implements OnChanges, OnDestroy {
  constructor(private elmRef: ElementRef<HTMLInputElement>, @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  private readonly ngOnDestroy$ = new Subject()
  private readonly ngOnChange$ = new Subject()

  private readonly setVideoVolume = (vol: number) => this.maybeVideoElement().tapSome(ve => ve.volume = vol)
  private readonly setInputValue = (value: string) => this.elmRef.nativeElement.value = value
  private readonly getCurrentInputValue = () => +this.elmRef.nativeElement.value

  ngOnChanges(_changes: SimpleChanges) {
    this.ngOnChange$.next()

    this.maybeVideoElement().tapSome(ve => {
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
