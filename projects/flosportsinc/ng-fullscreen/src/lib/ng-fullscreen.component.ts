import { Component, ChangeDetectionStrategy, ContentChild, TemplateRef, HostListener, Input, Inject } from '@angular/core'
import { FloFullscreenOnDirective, FloFullscreenOffDirective } from './ng-fullscreen.directive'
import { DOCUMENT } from '@angular/common'
import { fromEvent, merge, BehaviorSubject, Subject } from 'rxjs'
import { debounceTime, map, startWith } from 'rxjs/operators'
import {
  FS_FULLSCREEN_REQUEST_EVENTS, FS_FULLSCREEN_EXIT_EVENTS, FS_FULLSCREEN_CHANGE_EVENTS,
  FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, FS_FULLSCREEN_ELEMENT
} from './ng-fullscreen.tokens'

const filterAndExecute =
  (ref: Object) =>
    (arr: ReadonlyArray<string>) => arr.
      filter(a => typeof ref[a] === 'function')
      .forEach(a => ref[a]())

@Component({
  selector: 'flo-fullscreen',
  templateUrl: './ng-fullscreen.component.html',
  styleUrls: ['./ng-fullscreen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloFullscreenComponent {
  // tslint:disable: readonly-array
  constructor(@Inject(DOCUMENT) private doc: any,
    @Inject(FS_FULLSCREEN_REQUEST_EVENTS) private requestEventKeys: string[],
    @Inject(FS_FULLSCREEN_EXIT_EVENTS) private exitEventKeys: string[],
    @Inject(FS_FULLSCREEN_ELEMENT) private elementKeys: string[],
    @Inject(FS_FULLSCREEN_CHANGE_EVENTS) private changeEventKeys: string[],
    @Inject(FS_FULLSCREEN_ELEMENT_ERROR_EVENTS) private elementErrorEventKeys: string[]
  ) { }

  @HostListener('click')
  click() {
    // tslint:disable: no-if-statement
    if (this.fsSource.getValue()) {
      this.exitFullscreen()
    } else if (this.targetRef) {
      this.goFullscreen(this.targetRef)
    }
  }

  @ContentChild(FloFullscreenOnDirective, { read: TemplateRef }) readonly fullscreenOnTemplateRef: TemplateRef<HTMLElement>
  @ContentChild(FloFullscreenOffDirective, { read: TemplateRef }) readonly fullscreenOffTemplateRef: TemplateRef<HTMLElement>

  @Input()
  public readonly targetRef?: HTMLElement

  // readonly canTakeFullscreen = () =>
  readonly isFullscreen = () => this.elementKeys.reduce((acc, curr) => acc || this.doc[curr] ? true : false, false)

  goFullscreen(ref: HTMLElement) {
    filterAndExecute(ref)(this.requestEventKeys)
  }

  exitFullscreen() {
    filterAndExecute(this.doc)(this.exitEventKeys)
  }

  private readonly fsSource = new BehaviorSubject(this.isFullscreen())
  private readonly fsErrorSource = new Subject()
  private readonly fs$ = this.fsSource.asObservable()
  public readonly templateRef$ = this.fs$.pipe(map(tf => {
    return tf ? this.fullscreenOnTemplateRef : this.fullscreenOffTemplateRef
  }))

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    if (this.targetRef) {
      const target = this.targetRef
      // status change
      merge(...this.changeEventKeys.map(key => fromEvent(target, key)))
        .pipe(debounceTime(0), map(_ => this.isFullscreen()))
        .subscribe(val => this.fsSource.next(val))

      // err change
      merge(...this.elementErrorEventKeys.map(key => fromEvent(target, key)))
        .pipe(debounceTime(0))
        .subscribe(err => this.fsErrorSource.next(err))
    }
  }

  ngOnDestroy() { }
}
