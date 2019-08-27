import { Directive, TemplateRef, ViewContainerRef, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core'
import { AdBlockService } from './ad-block.service'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

export abstract class FloAdBlockDirective implements OnInit, OnDestroy {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef,
    protected ads: AdBlockService, protected cd: ChangeDetectorRef) { }

  protected readonly ngOnDestroy$ = new Subject()
  // tslint:disable-next-line: readonly-keyword
  protected showWhenAdBlocked: boolean

  ngOnInit() {
    this.ads.isAnAdBlockerActive()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(isActive => {
        if (isActive) {
          if (this.showWhenAdBlocked) {
            this.vc.createEmbeddedView(this.tr)
          } else {
            this.vc.clear()
          }
        } else {
          if (this.showWhenAdBlocked) {
            this.vc.clear()
          } else {
            this.vc.createEmbeddedView(this.tr)
          }
        }
        this.cd.detectChanges()
      })
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next()
    this.ngOnDestroy$.complete()
  }
}

const IF_BLOCKED_SELECTOR = 'floIfAdBlocked'
const IF_NOT_BLOCKED_SELECTOR = 'floIfNotAdBlocked'

@Directive({
  selector: `[${IF_BLOCKED_SELECTOR}]`,
  inputs: [IF_BLOCKED_SELECTOR]
})
export class FloIfAdBlockedDirective extends FloAdBlockDirective {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected ads: AdBlockService,
    protected cd: ChangeDetectorRef) {
    super(tr, vc, ads, cd)
    this.showWhenAdBlocked = true
  }

  readonly elmInputKey = IF_BLOCKED_SELECTOR
}

@Directive({
  selector: `[${IF_NOT_BLOCKED_SELECTOR}]`,
  inputs: [IF_NOT_BLOCKED_SELECTOR]
})
export class FloIfNotAdBlockedDirective extends FloAdBlockDirective {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected ads: AdBlockService,
    protected cd: ChangeDetectorRef) {
    super(tr, vc, ads, cd)
    this.showWhenAdBlocked = false
  }

  readonly elmInputKey = IF_NOT_BLOCKED_SELECTOR
}
