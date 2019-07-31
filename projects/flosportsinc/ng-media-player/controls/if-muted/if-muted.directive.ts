import { OnDestroy, OnChanges, TemplateRef, ViewContainerRef, SimpleChanges, Directive } from '@angular/core'
import { Subject, fromEvent } from 'rxjs'
import { takeUntil, map, distinctUntilChanged, startWith } from 'rxjs/operators'

// tslint:disable: readonly-keyword

export abstract class FloMediaMutedBaseDirective implements OnDestroy, OnChanges {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) { }

  private readonly ngOnChanges$ = new Subject()
  protected abstract biasRight: boolean
  protected abstract inputKey: string

  ngOnChanges(change: SimpleChanges) {
    const mediaRefInput = change[this.inputKey].currentValue
    if (mediaRefInput) {
      this.ngOnChanges$.next()
      if (mediaRefInput instanceof HTMLMediaElement) {

        fromEvent(mediaRefInput, 'volumechange').pipe(
          map(_ => mediaRefInput.muted || mediaRefInput.volume === 0),
          startWith(mediaRefInput.muted || mediaRefInput.volume === 0),
          distinctUntilChanged(),
          takeUntil(this.ngOnChanges$))
          .subscribe(isMuted => {
            if (this.biasRight && !isMuted || !this.biasRight && isMuted) {
              this.vc.createEmbeddedView(this.tr)
            } else {
              this.vc.clear()
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

const IF_MEDIA_UNMUTED_SELECTOR = 'floIfMediaUnmuted'

@Directive({
  selector: `[${IF_MEDIA_UNMUTED_SELECTOR}]`,
  inputs: [IF_MEDIA_UNMUTED_SELECTOR]
})
export class FloMediaIfUnmutedDirective extends FloMediaMutedBaseDirective {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) {
    super(tr, vc)
  }
  protected biasRight = true
  protected inputKey = IF_MEDIA_UNMUTED_SELECTOR
}

const IF_MEDIA_MUTED_SELECTOR = 'floIfMediaMuted'

@Directive({
  selector: `[${IF_MEDIA_MUTED_SELECTOR}]`,
  inputs: [IF_MEDIA_MUTED_SELECTOR]
})
export class FloMediaIfMutedDirective extends FloMediaMutedBaseDirective {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) {
    super(tr, vc)
  }
  protected biasRight = false
  protected inputKey = IF_MEDIA_MUTED_SELECTOR
}
