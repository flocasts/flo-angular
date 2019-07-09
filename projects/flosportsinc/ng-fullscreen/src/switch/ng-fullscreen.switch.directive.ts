import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy, Input } from '@angular/core'
import { takeUntil, filter, flatMap } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { FloFullscreenService } from '../common/ng-fullscreen.service'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
export abstract class FloFullscreenDirective implements OnDestroy, OnInit {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected fs: FloFullscreenService) { }

  protected readonly ngOnDestroy$ = new Subject()
  protected showWhenFullscreen = false
  protected abstract elmInputKey?: string
  protected readonly elm = () => this.elmInputKey ? this[this.elmInputKey] as HTMLElement : undefined

  ngOnInit() {
    this.fs.fullscreenIsSupported(this.elm())
      .pipe(
        filter(Boolean),
        flatMap(() => this.fs.fullscreen$),
        takeUntil(this.ngOnDestroy$)
      ).subscribe(isFullscreen => {
        if (this.showWhenFullscreen && isFullscreen) {
          this.vc.createEmbeddedView(this.tr)
        } else if (!isFullscreen && !this.showWhenFullscreen) {
          this.vc.createEmbeddedView(this.tr)
        } else {
          this.vc.clear()
        }
      })
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next()
    this.ngOnDestroy$.complete()
  }
}

const IF_FS_SELECTOR = 'floIfFullscreen'

@Directive({
  selector: `[${IF_FS_SELECTOR}]`,
  inputs: [IF_FS_SELECTOR]
})
export class FloFullscreenOnDirective extends FloFullscreenDirective {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected fs: FloFullscreenService) {
    super(tr, vc, fs)
    this.showWhenFullscreen = true
  }

  elmInputKey = IF_FS_SELECTOR
}

const IF_NOT_FS_SELECTOR = 'floIfNotFullscreen'

@Directive({
  selector: `[${IF_NOT_FS_SELECTOR}]`,
  inputs: [IF_NOT_FS_SELECTOR]
})
export class FloFullscreenOffDirective extends FloFullscreenDirective {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected fs: FloFullscreenService) {
    super(tr, vc, fs)
    this.showWhenFullscreen = false
  }

  elmInputKey = IF_NOT_FS_SELECTOR
}
