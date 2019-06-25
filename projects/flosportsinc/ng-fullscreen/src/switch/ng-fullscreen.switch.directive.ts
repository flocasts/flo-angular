import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy, Input } from '@angular/core'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { FloFullscreenService } from '../common/ng-fullscreen.service'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
export abstract class FloFullscreenDirective implements OnDestroy, OnInit {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected fs: FloFullscreenService) { }

  protected readonly ngOnDestroy$ = new Subject()
  protected showWhenFullscreen = false

  ngOnInit() {
    if (!this.fs.fullscreenIsSupported()) { return }
    this.fs.fullscreen$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(isFullscreen => {
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

@Directive({
  selector: '[floIfFullscreen]',
})
export class FloFullscreenOnDirective extends FloFullscreenDirective {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected fs: FloFullscreenService) {
    super(tr, vc, fs)
    this.showWhenFullscreen = true
  }
}

@Directive({
  selector: '[floIfNotFullscreen]',
})
export class FloFullscreenOffDirective extends FloFullscreenDirective {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected fs: FloFullscreenService) {
    super(tr, vc, fs)
    this.showWhenFullscreen = false
  }
}
