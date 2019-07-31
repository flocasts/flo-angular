import { OnDestroy, OnChanges, TemplateRef, ViewContainerRef, SimpleChanges, Directive, ChangeDetectorRef } from '@angular/core'
import { Subject, fromEvent, merge } from 'rxjs'
import { takeUntil, mapTo, startWith } from 'rxjs/operators'
import { either } from 'typescript-monads'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword

export abstract class FloMediaPlayPauseBaseDirective implements OnDestroy, OnChanges {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef, protected cd: ChangeDetectorRef) { }

  private readonly ngOnChanges$ = new Subject()
  protected abstract biasRight: boolean
  protected abstract inputKey: string

  attempt () {
    if (!this.vc.length) {
      const viewRef = this.vc.createEmbeddedView(this.tr)
      const node = viewRef.rootNodes[0]
      if (node) {
        // node.focus()
      }
    }
  }

  ngOnChanges(change: SimpleChanges) {
    const mediaRefInput = change[this.inputKey].currentValue
    if (mediaRefInput) {
      this.ngOnChanges$.next()
      if (mediaRefInput instanceof HTMLMediaElement) {
        const paused$ = fromEvent(mediaRefInput, 'pause').pipe(
          mapTo(either<boolean, boolean>(undefined, true)),
          startWith(mediaRefInput.paused ? either<boolean, boolean>(undefined, true) : either<boolean, boolean>(true, undefined))
        )

        const playing$ = merge(fromEvent(mediaRefInput, 'play'), fromEvent(mediaRefInput, 'playing')).pipe(
          mapTo(either<boolean, boolean>(true, undefined)),
          startWith(!mediaRefInput.paused ? either<boolean, boolean>(true, undefined) : either<boolean, boolean>(undefined, true))
        )

        merge(paused$, playing$).pipe(takeUntil(this.ngOnChanges$)).subscribe(res => {
          res.tap({
            left: () => {
              if (!this.biasRight) {
                this.attempt()
              } else {
                this.vc.clear()
              }
            },
            right: () => {
              if (this.biasRight) {
                this.attempt()
              } else {
                this.vc.clear()
              }
            }
          })
          this.cd.markForCheck()
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
const IF_MEDIA_PLAYING_SELECTOR = 'floIfMediaPlaying'

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
