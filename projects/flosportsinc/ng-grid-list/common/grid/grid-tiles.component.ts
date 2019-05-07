import { Subject, fromEvent, of, interval, merge } from 'rxjs'
import { isPlatformServer } from '@angular/common'
import { map, startWith, mapTo, share, switchMapTo, tap, distinctUntilChanged } from 'rxjs/operators'
import {
  Component, ChangeDetectionStrategy, Input, Output,
  Inject, PLATFORM_ID, ElementRef, ContentChild, TemplateRef
} from '@angular/core'
import {
  FLO_GRID_LIST_DEFAULT_VIEWCOUNT, FLO_GRID_LIST_MIN_VIEWCOUNT, FLO_GRID_LIST_MAX_VIEWCOUNT,
  FLO_GRID_LIST_OVERLAY_ENABLED,
  FLO_GRID_LIST_OVERLAY_FADEOUT,
  FLO_GRID_LIST_OVERLAY_THROTTLE,
  FLO_GRID_LIST_OVERLAY_NG_CLASS,
  FLO_GRID_LIST_OVERLAY_NG_STYLE
} from '../ng-grid-list.tokens'
import { FloGridListOverlayDirective } from './grid.overlay.directive'

// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword
// tslint:disable: no-if-statement

@Component({
  selector: 'flo-grid-tiles',
  templateUrl: './grid-tiles.component.html',
  styleUrls: ['./grid-tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloGridTilesComponent {
  constructor(
    private _elmRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private _platformId: string,
    @Inject(FLO_GRID_LIST_DEFAULT_VIEWCOUNT) private _count: number,
    @Inject(FLO_GRID_LIST_MIN_VIEWCOUNT) private _min: number,
    @Inject(FLO_GRID_LIST_MAX_VIEWCOUNT) private _max: number,
    @Inject(FLO_GRID_LIST_OVERLAY_ENABLED) private _overlayEnabled: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_ENABLED) private _overlayStart: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_FADEOUT) private _overlayFadeout: number,
    @Inject(FLO_GRID_LIST_OVERLAY_THROTTLE) private _overlayThrottle: number,
    @Inject(FLO_GRID_LIST_OVERLAY_NG_CLASS) private _overlayNgClass: Object,
    @Inject(FLO_GRID_LIST_OVERLAY_NG_STYLE) private _overlayNgStyle: Object
  ) { }

  @Input()
  get count() {
    return this._count
  }
  set count(val: number) {
    if (val >= this._min && val <= this._max) {
      this._count = val
      this.countChange.next(this._count)
    }
  }

  public setCount(count: number) {
    this.count = count
  }

  @Input()
  get min() {
    return this._count
  }
  set min(val: number) {
    this._count = val
    this.minChange.next(this._count)
  }

  public setMin(min: number) {
    this.min = min
  }

  @Input()
  get max() {
    return this._max
  }
  set max(val: number) {
    this._max = val
    this.maxChange.next(this._max)
  }

  public setMax(min: number) {
    this.max = min
  }

  @Input()
  get overlayEnabled() {
    return this._overlayEnabled
  }
  set overlayEnabled(enabled: boolean) {
    this._overlayEnabled = enabled
    this.overlayEnabledChange.next(enabled)
  }

  public setOverlayEnabled(enabled: boolean) {
    this.overlayEnabled = enabled
  }

  @Input()
  get overlayStart() {
    return this._overlayStart
  }
  set overlayStart(start: boolean) {
    this._overlayStart = start
    this.overlayStartChange.next(start)
  }

  public setOverlayStart(start: boolean) {
    this.overlayStart = start
  }

  @Input()
  get overlayFadeout() {
    return this._overlayFadeout
  }
  set overlayFadeout(fadeout: number) {
    this._overlayFadeout = fadeout
    this.overlayFadeoutChange.next(fadeout)
  }

  public setOverlayFadeout(fadeout: number) {
    this.overlayFadeout = fadeout
  }

  @Input()
  get overlayThrottle() {
    return this._overlayThrottle
  }
  set overlayThrottle(throttle: number) {
    this._overlayThrottle = throttle
    this.overlayThrottleChange.next(throttle)
  }

  public setOverlayThrottle(throttle: number) {
    this.overlayThrottle = throttle
  }

  @Input()
  get overlayNgClass() {
    return this._overlayNgClass
  }
  set overlayNgClass(ngClass: object) {
    this._overlayNgClass = ngClass
    this.overlayNgClassChange.next(ngClass)
  }

  public setOverlayNgClass(ngClass: object) {
    this.overlayNgClass = ngClass
  }

  @Input()
  get overlayNgStyle() {
    return this._overlayNgStyle
  }
  set overlayNgStyle(ngStyle: object) {
    this._overlayNgStyle = ngStyle
    this.overlayNgStyleChange.next(ngStyle)
  }

  public setOverlayNgStyle(ngStyle: object) {
    this.overlayNgStyle = ngStyle
  }

  @Output() public readonly countChange = new Subject<number>()
  @Output() public readonly minChange = new Subject<number>()
  @Output() public readonly maxChange = new Subject<number>()
  @Output() public readonly overlayEnabledChange = new Subject<boolean>()
  @Output() public readonly overlayStartChange = new Subject<boolean>()
  @Output() public readonly overlayFadeoutChange = new Subject<number>()
  @Output() public readonly overlayThrottleChange = new Subject<number>()
  @Output() public readonly overlayNgClassChange = new Subject<Object>()
  @Output() public readonly overlayNgStyleChange = new Subject<Object>()

  @ContentChild(FloGridListOverlayDirective, { read: TemplateRef }) readonly gridListOverlayTemplate: TemplateRef<HTMLElement>

  private cursorInsideElement = merge(
    fromEvent(this._elmRef.nativeElement, 'mousemove').pipe(mapTo(true), tap(() => this.fadeoutIntervalReset.next(true))),
    fromEvent(this._elmRef.nativeElement, 'mouseenter').pipe(mapTo(true)),
    fromEvent(this._elmRef.nativeElement, 'mouseleave').pipe(mapTo(false))
  ).pipe(startWith(this.overlayStart))

  private readonly fadeoutIntervalReset = new Subject<boolean>()
  private readonly fadeoutInterval = interval(this.overlayFadeout).pipe(mapTo(false), startWith(this.overlayStart))
  private readonly fadeoutIntervalWithReset = this.fadeoutIntervalReset.pipe(startWith(false), switchMapTo(this.fadeoutInterval))

  public readonly showOverlay = (isPlatformServer(this._platformId)
    ? of(false)
    : this.overlayEnabled
      ? merge(this.cursorInsideElement, this.fadeoutIntervalWithReset)
      : of(false)
  ).pipe(distinctUntilChanged(), share())

  public readonly hideOverlay = this.showOverlay.pipe(map(show => !show))
}
