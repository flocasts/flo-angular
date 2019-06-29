import { OnDestroy, OnChanges, TemplateRef, ViewContainerRef, SimpleChanges, Directive } from '@angular/core'
import { debounceTime, startWith, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

export abstract class FloMediaRepeatBaseDirective implements OnDestroy, OnChanges {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) { }

  protected readonly ngOnChanges$ = new Subject()
  protected readonly loopChage$ = new Subject()
  protected abstract bias: boolean
  protected abstract inputKey: string

  private mutatonObsRef?: MutationObserver

  private resetMutationObs = () => {
    if (this.mutatonObsRef) {
      this.mutatonObsRef.disconnect()
      this.mutatonObsRef = undefined
    }
  }

  ngOnChanges(change: SimpleChanges) {
    const mediaRefInput = change[this.inputKey].currentValue
    if (mediaRefInput) {
      this.ngOnChanges$.next()
      this.resetMutationObs()
      if (mediaRefInput instanceof HTMLMediaElement) {
        this.loopChage$.pipe(debounceTime(0), startWith(mediaRefInput.loop), takeUntil(this.ngOnChanges$))
          .subscribe(val => {
            if (this.bias !== val) {
              this.vc.clear()
            } else if (this.vc.length === 0) {
              this.vc.createEmbeddedView(this.tr)
            }
          })

        this.mutatonObsRef = new MutationObserver((mutations: ReadonlyArray<MutationRecord>) => {
          mutations
            .filter(m => m.attributeName === 'loop')
            .forEach(_ => this.loopChage$.next(mediaRefInput.loop))
        })

        this.mutatonObsRef.observe(mediaRefInput, {
          attributes: true,
          childList: false,
          characterData: false
        })
      }
    }
  }

  ngOnDestroy() {
    this.resetMutationObs()
    this.ngOnChanges$.next()
    this.ngOnChanges$.complete()
  }
}

const ENABLED_SELECTOR = 'floIfMediaLoopEnabled'

@Directive({
  selector: `[${ENABLED_SELECTOR}]`,
  inputs: [ENABLED_SELECTOR]
})
export class FloMediaIfRepeatEnabledDirective extends FloMediaRepeatBaseDirective {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) {
    super(tr, vc)
  }
  protected bias = true
  protected inputKey = ENABLED_SELECTOR
}

const DISABLED_SELECTOR = 'floIfMediaLoopDisabled'

@Directive({
  selector: `[${DISABLED_SELECTOR}]`,
  inputs: [DISABLED_SELECTOR]
})
export class FloMediaIfRepeatDisabledPlayingDirective extends FloMediaRepeatBaseDirective {
  constructor(protected tr: TemplateRef<HTMLElement>, protected vc: ViewContainerRef) {
    super(tr, vc)
  }
  protected bias = false
  protected inputKey = DISABLED_SELECTOR
}
