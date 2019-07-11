import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core'
import { takeUntil, flatMap, startWith, delay, map, tap } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { FloFullscreenService } from '../common/ng-fullscreen.service'

// tslint:disable: no-if-statement
// tslint:disable: readonly-keyword
export abstract class FloFullscreenDirective implements OnDestroy, OnInit, OnChanges {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected fs: FloFullscreenService,
    protected cd: ChangeDetectorRef) { }

  protected showWhenFullscreen = false
  protected readonly ngOnDestroy$ = new Subject()
  protected abstract elmInputKey?: string
  protected readonly elm = () => this.elmInputKey ? this[this.elmInputKey] as HTMLElement : undefined
  private elmSource = new Subject<HTMLElement | undefined>()
  protected readonly elm$ = this.elmSource.asObservable()

  ngOnInit() {
    this.elm$.pipe(
      tap(() => this.cd.detectChanges()),
      startWith(this.elm()),
      delay(0),
      flatMap(elm => this.fs.fullscreenIsSupported(elm)),
      flatMap(isSupported => this.fs.fullscreen$.pipe(map(isFullscreen => ({ isSupported, isFullscreen })))),
      takeUntil(this.ngOnDestroy$)
    ).subscribe(res => {
      this.vc.clear()
      if (this.showWhenFullscreen) { // exit
        if (res.isFullscreen) {
          this.vc.createEmbeddedView(this.tr)
        }
      } else if (!res.isFullscreen) { // enter
        if (res.isSupported) {
          this.vc.createEmbeddedView(this.tr)
        }
      }
    })
  }

  ngOnChanges(sc: SimpleChanges) {
    if (this.elmInputKey && sc[this.elmInputKey]) {
      this.elmSource.next(sc[this.elmInputKey].currentValue)
    }
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
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected fs: FloFullscreenService,
    protected cd: ChangeDetectorRef) {
    super(tr, vc, fs, cd)
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
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected fs: FloFullscreenService,
    protected cd: ChangeDetectorRef) {
    super(tr, vc, fs, cd)
    this.showWhenFullscreen = false
  }

  elmInputKey = IF_NOT_FS_SELECTOR
}
