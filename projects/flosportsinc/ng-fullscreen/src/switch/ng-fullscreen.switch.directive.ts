import {
  Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy,
  SimpleChanges, OnChanges, ChangeDetectorRef, Inject
} from '@angular/core'
import { takeUntil, flatMap, startWith, delay, tap, distinctUntilChanged } from 'rxjs/operators'
import { Subject, combineLatest, interval } from 'rxjs'
import { FloFullscreenService } from '../common/ng-fullscreen.service'
import { isIphone } from '../common/util'
import { FS_FULLSCREEN_IOS_POLL_MS, FS_FULLSCREEN_IOS_POLL_ENABLED } from '../common/ng-fullscreen.tokens'

// tslint:disable: readonly-keyword
export abstract class FloFullscreenDirective implements OnDestroy, OnInit, OnChanges {
  constructor(protected tr: TemplateRef<any>, protected vc: ViewContainerRef, protected fs: FloFullscreenService,
    protected cd: ChangeDetectorRef, @Inject(FS_FULLSCREEN_IOS_POLL_ENABLED) protected iosPollEnabled: boolean,
    @Inject(FS_FULLSCREEN_IOS_POLL_MS) protected iosPollrate: number) { }

  protected abstract elmInputKey?: string
  private readonly elmSource = new Subject<HTMLElement | undefined>()

  protected showWhenFullscreen = false
  protected readonly ngOnDestroy$ = new Subject()
  protected readonly elm = () => this.elmInputKey ? this[this.elmInputKey] as HTMLElement : undefined
  protected readonly elm$ = this.elmSource.asObservable()

  ngOnInit() {
    combineLatest(
      this.fs.fullscreen$,
      this.elm$.pipe(
        tap(() => this.cd.detectChanges()),
        startWith(this.elm()),
        delay(0),
        flatMap(elm => this.iosPollEnabled && isIphone()
          ? interval(this.iosPollrate).pipe(
            flatMap(() => this.fs.fullscreenIsSupported(elm)),
            distinctUntilChanged(),
            takeUntil(this.ngOnDestroy$))
          : this.fs.fullscreenIsSupported(elm)
        ),
        takeUntil(this.ngOnDestroy$)
      )
    ).pipe(takeUntil(this.ngOnDestroy$)).subscribe(res => {
      const isFullscreen = res[0]
      const isSupported = res[1]
      this.vc.clear()
      if (this.showWhenFullscreen) { // exit
        if (isFullscreen) {
          this.vc.createEmbeddedView(this.tr)
        }
      } else if (!isFullscreen) { // enter
        if (isSupported) {
          this.vc.createEmbeddedView(this.tr)
        }
      }
      this.cd.detectChanges()
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
    protected cd: ChangeDetectorRef, @Inject(FS_FULLSCREEN_IOS_POLL_ENABLED) protected iosPollEnabled: boolean,
    @Inject(FS_FULLSCREEN_IOS_POLL_MS) protected iosPollrate: number) {
    super(tr, vc, fs, cd, iosPollEnabled, iosPollrate)
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
    protected cd: ChangeDetectorRef, @Inject(FS_FULLSCREEN_IOS_POLL_ENABLED) protected iosPollEnabled: boolean,
    @Inject(FS_FULLSCREEN_IOS_POLL_MS) protected iosPollrate: number) {
    super(tr, vc, fs, cd, iosPollEnabled, iosPollrate)
    this.showWhenFullscreen = false
  }

  elmInputKey = IF_NOT_FS_SELECTOR
}
