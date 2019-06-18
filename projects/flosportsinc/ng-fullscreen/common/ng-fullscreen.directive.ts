import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy, HostListener, Input, Inject } from '@angular/core'
import { FloFullscreenService } from './ng-fullscreen.service'
import { takeUntil, tap, take } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { DOCUMENT } from '@angular/common'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
export abstract class FloFullscreenDirective implements OnDestroy, OnInit {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected fs: FloFullscreenService) { }

  protected readonly ngOnDestroy$ = new Subject()
  protected showWhenFullscreen = false

  ngOnInit() {
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

// tslint:disable: no-object-mutation
@Directive({
  selector: '[floClickToEnterFullscreen]',
})
export class FloClickToEnterFullscreenDirective {
  constructor(private fs: FloFullscreenService, @Inject(DOCUMENT) private doc: any) { }

  private _thing: HTMLElement | HTMLDocument

  @Input()
  get floClickToEnterFullscreen() {
    return this._thing
  }
  set floClickToEnterFullscreen(val: any) {
    if (val instanceof HTMLElement) {
      this._thing = val
    } else {
      this._thing = this.doc.body
    }
  }

  @HostListener('click', []) click() {
    this.fs.isNotFullscreen$.pipe(tap(_ => {
      setTimeout(() => this.fs.goFullscreen(this.floClickToEnterFullscreen))
    })).pipe(take(1)).subscribe()
  }
}

@Directive({
  selector: '[floClickToExitFullscreen]',
})
export class FloClickToExitFullscreenDirective {
  constructor(private fs: FloFullscreenService) { }

  @HostListener('click', []) click() {
    this.fs.exitFullscreen()
  }
}
