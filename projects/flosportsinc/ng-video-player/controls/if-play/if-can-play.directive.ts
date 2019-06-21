import { Directive, TemplateRef, ViewContainerRef, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core'
import { Subject, fromEvent, merge } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword

export abstract class DDD implements OnDestroy, OnChanges {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) { }

  private readonly ngOnChanges$ = new Subject()
  protected abstract biasRight: boolean
  protected abstract inputKey: string

  ngOnChanges(change: SimpleChanges) {
    const videoRefInput = change[this.inputKey].currentValue
    if (videoRefInput) {
      this.ngOnChanges$.next()
      if (videoRefInput instanceof HTMLVideoElement) {
        fromEvent(videoRefInput, 'pause')
          .pipe(takeUntil(this.ngOnChanges$))
          .subscribe(() => {
            if (this.biasRight) {
              this.vc.createEmbeddedView(this.tr)
            } else {
              this.vc.clear()
            }
          })

        merge(fromEvent(videoRefInput, 'play'), fromEvent(videoRefInput, 'playing'))
          .pipe(takeUntil(this.ngOnChanges$))
          .subscribe(() => {
            if (this.biasRight) {
              this.vc.clear()
            } else {
              if (!this.vc.get(0)) {
                this.vc.createEmbeddedView(this.tr)
              }
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

const IF_MEDIA_PAUSED_SELECTOR = 'floIfMediaPaused'

@Directive({
  selector: `[${IF_MEDIA_PAUSED_SELECTOR}]`,
})
export class FloIfPlayVideoControlDirective extends DDD {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) {
    super(tr, vc)
  }
  protected biasRight = true
  protected inputKey = IF_MEDIA_PAUSED_SELECTOR

  @Input() readonly floIfMediaPaused?: HTMLVideoElement
}

const IF_MEDIA_PLAYING_SELECTOR = 'floIfMediaPlaying'

@Directive({
  selector: `[${IF_MEDIA_PLAYING_SELECTOR}]`,
})
export class FloIfNotPlayVideoControlDirective extends DDD {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) {
    super(tr, vc)
  }
  protected biasRight = false
  protected inputKey = IF_MEDIA_PLAYING_SELECTOR

  @Input() readonly floIfMediaPlaying?: HTMLVideoElement
}
