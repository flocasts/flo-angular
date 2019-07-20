import { OnDestroy, OnChanges, TemplateRef, ViewContainerRef, SimpleChanges, Directive, Inject } from '@angular/core'
import { takeUntil, filter, shareReplay, map, distinctUntilChanged } from 'rxjs/operators'
import { FloPictureInPictureNativeService } from '../mp-pip-native/mpc-pip-native.service'
import { Subject, fromEvent, merge } from 'rxjs'
import { DOCUMENT } from '@angular/common'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword

export abstract class FloMediaPipNativeBaseDirective implements OnDestroy, OnChanges {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef, protected ps: FloPictureInPictureNativeService,
    @Inject(DOCUMENT) protected doc: any) { }

  private readonly ngOnChanges$ = new Subject()
  protected abstract biasRight: boolean
  protected abstract inputKey: string

  ngOnChanges(change: SimpleChanges) {
    const mediaRefInput = change[this.inputKey].currentValue

    if (mediaRefInput) {
      this.ngOnChanges$.next()

      if (mediaRefInput instanceof HTMLMediaElement) {
        const safariPresentationMode = fromEvent(mediaRefInput, 'webkitpresentationmodechanged').pipe(
          map(_ => this.ps.isPipActive()), distinctUntilChanged(), shareReplay(1))

        const safariEnteredPip = safariPresentationMode.pipe(filter(a => a === true))
        const safariLeavePip = safariPresentationMode.pipe(filter(a => a === false))

        merge(fromEvent(mediaRefInput, 'loadedmetadata'), fromEvent(mediaRefInput, 'leavepictureinpicture'), safariLeavePip)
          .pipe(takeUntil(this.ngOnChanges$))
          .subscribe(() => {
            if (this.biasRight && this.vc.length === 0) {
              this.vc.createEmbeddedView(this.tr)
            } else {
              this.vc.clear()
            }
          })

        merge(fromEvent(mediaRefInput, 'enterpictureinpicture'), safariEnteredPip)
          .pipe(takeUntil(this.ngOnChanges$))
          .subscribe(() => {
            if (this.biasRight) {
              this.vc.clear()
            } else if (this.vc.length === 0) {
              this.vc.createEmbeddedView(this.tr)
            }
          })
      }
    }
  }

  ngOnDestroy() {
    this.ngOnChanges$.next()
    this.ngOnChanges$.complete()
  }
}

const IF_CAN_ENTER_PIP_SELECTOR = 'floIfMediaCanEnterNativePip'

@Directive({
  selector: `[${IF_CAN_ENTER_PIP_SELECTOR}]`,
  inputs: [IF_CAN_ENTER_PIP_SELECTOR]
})
export class FloMediaIfCanEnterPipNativeDirective extends FloMediaPipNativeBaseDirective {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef, protected ps: FloPictureInPictureNativeService,
    @Inject(DOCUMENT) protected doc: any) {
    super(tr, vc, ps, doc)
  }
  protected biasRight = true
  protected inputKey = IF_CAN_ENTER_PIP_SELECTOR
}

const IF_MEDIA_EXIT_PIP_SELECTOR = 'floIfMediaCanExitNativePip'

@Directive({
  selector: `[${IF_MEDIA_EXIT_PIP_SELECTOR}]`,
  inputs: [IF_MEDIA_EXIT_PIP_SELECTOR]
})
export class FloMediaIfCanExitPipNativeDirective extends FloMediaPipNativeBaseDirective {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef, protected ps: FloPictureInPictureNativeService,
    @Inject(DOCUMENT) protected doc: any) {
    super(tr, vc, ps, doc)
  }
  protected biasRight = false
  protected inputKey = IF_MEDIA_EXIT_PIP_SELECTOR
}
