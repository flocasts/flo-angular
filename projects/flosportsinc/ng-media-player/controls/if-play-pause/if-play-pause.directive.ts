import { OnDestroy, OnChanges, TemplateRef, ViewContainerRef, SimpleChanges, Directive, ChangeDetectorRef } from '@angular/core'
import { Subject, fromEvent, merge, of } from 'rxjs'
import { takeUntil, filter } from 'rxjs/operators'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword

export abstract class FloMediaPlayPauseBaseDirective implements OnDestroy, OnChanges {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef, protected cd: ChangeDetectorRef) { }

  private readonly ngOnChanges$ = new Subject()
  protected abstract biasRight: boolean
  protected abstract inputKey: string

  ngOnChanges(change: SimpleChanges) {
    const mediaRefInput = change[this.inputKey].currentValue
    if (mediaRefInput) {
      this.ngOnChanges$.next()
      if (mediaRefInput instanceof HTMLMediaElement) {
        merge(of(mediaRefInput.paused).pipe(filter(Boolean)), fromEvent(mediaRefInput, 'pause'))
          .pipe(takeUntil(this.ngOnChanges$))
          .subscribe(() => {
            if (this.biasRight && this.vc.length === 0) {
              this.vc.createEmbeddedView(this.tr)
            } else {
              this.vc.clear()
            }
            this.cd.detectChanges()
          })

        merge(fromEvent(mediaRefInput, 'play'), fromEvent(mediaRefInput, 'playing'))
          .pipe(takeUntil(this.ngOnChanges$))
          .subscribe(() => {
            if (this.biasRight) {
              this.vc.clear()
            } else if (this.vc.length === 0) {
              this.vc.createEmbeddedView(this.tr)
            }
            this.cd.detectChanges()
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
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef, protected cd: ChangeDetectorRef) {
    super(tr, vc, cd)
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
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef, protected cd: ChangeDetectorRef) {
    super(tr, vc, cd)
  }
  protected biasRight = false
  protected inputKey = IF_MEDIA_PLAYING_SELECTOR
}
