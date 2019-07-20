import {
  Directive, Input, HostListener, ElementRef, Inject, ChangeDetectorRef,
  PLATFORM_ID, OnChanges, SimpleChanges, OnInit
} from '@angular/core'
import { FloMediaPlayerControlDirectiveBase, coerceInputToBoolean } from '../mpc-base.directive'
// import { VIDEO_PLAYER_CONTROLS_PLAY_FUNC, PlayControlFunction } from './mpc-play.tokens'

// tslint:disable: no-if-statement
// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword

@Directive({
  selector: 'input[type="range"],input[type="number"],[floMp][floMpPlaybackRate]',
})
export class FloVideoPlayerPlaybackRateInputControlDirective<TMeta = any> extends FloMediaPlayerControlDirectiveBase<TMeta>
  implements OnInit, OnChanges {
  constructor(private elmRef: ElementRef<HTMLInputElement>,
    private cd: ChangeDetectorRef,
    // @Inject(VIDEO_PLAYER_CONTROLS_PLAY_FUNC) private func: PlayControlFunction,
    @Inject(PLATFORM_ID) protected platformId: string) {
    super(platformId)
  }

  @Input() readonly min = '0'
  @Input() readonly max = '2'
  @Input() readonly step = '.1'

  private readonly getCurrentInputValue = () => +this.elmRef.nativeElement.value

  private readonly updateNativeAttributes = () => {
    this.elmRef.nativeElement.min = this.min
    this.elmRef.nativeElement.max = this.max
    this.elmRef.nativeElement.step = this.step
  }

  ngOnInit() {
    this.maybeMediaElement().tapSome(v => {
      this.elmRef.nativeElement.value = `${v.playbackRate}`
    })
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.updateNativeAttributes()

    // this.ngOnChange$.next()

    // this.maybeMediaElement().tapSome(ve => {
    //   fromEvent(ve, 'volumechange').pipe(takeUntil(this.ngOnChange$))
    //     .subscribe(_ => {
    //       if (ve.muted) {
    //         this.setInputValue('0')
    //       } else {
    //         this.setInputValue(`${ve.volume}`)
    //       }
    //     })
    // })
  }

  private _floMpPlaybackRate?: string | boolean

  @Input()
  get floMpPlaybackRate() {
    return this._floMpPlaybackRate
  }
  set floMpPlaybackRate(val: any) {
    this._floMpPlaybackRate = coerceInputToBoolean(val)
  }

  private readonly setVideoPlaybackRate = (rate: number) => {
    this.cd.detectChanges()
    this.maybeMediaElement().tapSome(ve => {
      ve.playbackRate = rate
    })
  }

  @HostListener('change')
  change() {
    this.setVideoPlaybackRate(this.getCurrentInputValue())
  }

  @HostListener('input')
  input() {
    this.setVideoPlaybackRate(this.getCurrentInputValue())
  }

  // @HostListener('click')
  // click() {
  //   this.cd.detectChanges()

  //   if (!this.floMpClickToPlay) { return }

  //   // this.maybeMediaElement().tapSome(ve => this.func(ve, this.elmRef, this.floMpMeta))
  // }
}
