import { OnDestroy, OnChanges, TemplateRef, ViewContainerRef, SimpleChanges, Directive, Input } from '@angular/core'
import { Subject, fromEvent, merge } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword

export abstract class FloMediaPlayPauseBaseDirective implements OnDestroy, OnChanges {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) { }

  private readonly ngOnChanges$ = new Subject()
  protected abstract biasRight: boolean
  protected abstract inputKey: string

  ngOnChanges(change: SimpleChanges) {
    const mediaRefInput = change[this.inputKey].currentValue
    if (mediaRefInput) {
      this.ngOnChanges$.next()
      if (mediaRefInput instanceof HTMLMediaElement) {
        fromEvent(mediaRefInput, 'pause')
          .pipe(takeUntil(this.ngOnChanges$))
          .subscribe(() => {
            if (this.biasRight && this.vc.length === 0) {
              this.vc.createEmbeddedView(this.tr)
            } else {
              this.vc.clear()
            }
          })

        merge(fromEvent(mediaRefInput, 'play'), fromEvent(mediaRefInput, 'playing'))
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

const IF_MEDIA_PAUSED_SELECTOR = 'floIfMediaPaused'

@Directive({
  selector: `[${IF_MEDIA_PAUSED_SELECTOR}]`,
  inputs: [IF_MEDIA_PAUSED_SELECTOR]
})
export class FloMediaIfPausedDirective extends FloMediaPlayPauseBaseDirective {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) {
    super(tr, vc)
  }
  protected biasRight = true
  protected inputKey = IF_MEDIA_PAUSED_SELECTOR
}

const IF_MEDIA_PLAYING_SELECTOR = 'floIfMediaPlaying'

@Directive({
  selector: `[${IF_MEDIA_PLAYING_SELECTOR}]`,
  inputs: [IF_MEDIA_PLAYING_SELECTOR]
})
export class FloMediaIfPlayingDirective extends FloMediaPlayPauseBaseDirective {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) {
    super(tr, vc)
  }
  protected biasRight = false
  protected inputKey = IF_MEDIA_PLAYING_SELECTOR
}
