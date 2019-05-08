import { Subject, fromEvent, of, interval, merge } from 'rxjs'
import { isPlatformServer } from '@angular/common'
import { map, startWith, mapTo, share, switchMapTo, tap, distinctUntilChanged } from 'rxjs/operators'
import { FloGridListOverlayDirective, FloGridListItemNoneDirective, FloGridListItemSomeDirective } from './grid.tiles.directive'
import { maybe } from 'typescript-monads'
import {
  Component, ChangeDetectionStrategy, Input, Output,
  Inject, PLATFORM_ID, ElementRef, ContentChild, TemplateRef, ViewChild, ViewChildren, QueryList, Renderer2, AfterViewInit
} from '@angular/core'
import {
  FLO_GRID_LIST_DEFAULT_VIEWCOUNT, FLO_GRID_LIST_MIN_VIEWCOUNT, FLO_GRID_LIST_MAX_VIEWCOUNT,
  FLO_GRID_LIST_OVERLAY_ENABLED,
  FLO_GRID_LIST_OVERLAY_FADEOUT,
  FLO_GRID_LIST_OVERLAY_THROTTLE,
  FLO_GRID_LIST_OVERLAY_NG_CLASS,
  FLO_GRID_LIST_OVERLAY_NG_STYLE,
  FLO_GRID_LIST_MAX_HEIGHT
} from '../ng-grid-list.tokens'

// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword
// tslint:disable: no-if-statement

@Component({
  selector: 'flo-grid-tiles',
  templateUrl: './grid-tiles.component.html',
  styleUrls: ['./grid-tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloGridTilesComponent implements AfterViewInit {
  constructor(
    private _elmRef: ElementRef<HTMLElement>,
    private _rd: Renderer2,
    @Inject(PLATFORM_ID) private _platformId: string,
    @Inject(FLO_GRID_LIST_DEFAULT_VIEWCOUNT) private _count: number,
    @Inject(FLO_GRID_LIST_MIN_VIEWCOUNT) private _min: number,
    @Inject(FLO_GRID_LIST_MAX_VIEWCOUNT) private _max: number,
    @Inject(FLO_GRID_LIST_MAX_HEIGHT) private _maxHeight: number,
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
  get maxheight() {
    return this._maxHeight
  }
  set maxheight(val: number) {
    this._maxHeight = val
    this.maxheightChange.next(val)
  }

  public setMaxheight(val: number) {
    this.maxheight = val
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

  public items: ReadonlyArray<any> = [
    { id: '123', prop: '123' },
    { id: '456', prop: '456' },
    { id: '789', prop: '789' },
    { id: '000', prop: '000' }
  ]

  get viewItems() {
    return new Array(this.count)
      .fill(maybe())
      .map((val, idx) => this.items[idx] ? maybe(this.items[idx]) :  val)
      .map((value, _idx) => {
        return {
          value: value.valueOrUndefined(),
          hasSomething: value.map(() => true).valueOr(false)
          // selected: this.selectedIndex === idx && this.viewcount > 1,
        }
      })
  }

  @Output() public readonly countChange = new Subject<number>()
  @Output() public readonly minChange = new Subject<number>()
  @Output() public readonly maxChange = new Subject<number>()
  @Output() public readonly maxheightChange = new Subject<number>()
  @Output() public readonly overlayEnabledChange = new Subject<boolean>()
  @Output() public readonly overlayStartChange = new Subject<boolean>()
  @Output() public readonly overlayFadeoutChange = new Subject<number>()
  @Output() public readonly overlayThrottleChange = new Subject<number>()
  @Output() public readonly overlayNgClassChange = new Subject<Object>()
  @Output() public readonly overlayNgStyleChange = new Subject<Object>()

  @ViewChild('floGridListContainer') readonly gridContainer: ElementRef<HTMLDivElement>
  @ViewChildren('floGridListItemContainer') readonly gridItemContainers: QueryList<ElementRef<HTMLDivElement>>

  @ContentChild(FloGridListItemSomeDirective, { read: TemplateRef }) readonly gridListItemSomeTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloGridListItemNoneDirective, { read: TemplateRef }) readonly gridListItemNoneTemplate: TemplateRef<HTMLElement>
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

  //
  //
  //
  //
  // GRID WORK IN PROGRESS
  ngAfterViewInit() {
    this.updateGridStyles(this.gridItemContainers.length)
    this.gridItemContainers.changes.subscribe(a => this.updateGridStyles(a.length))

    const observer = new MutationObserver(_mr => {
      const elements = Array.from(this.gridContainer.nativeElement.querySelectorAll('.flo-grid-list-item-container'))
      console.log(elements)
    })

    observer.observe(this.gridContainer.nativeElement,  { attributes: false, childList: true, subtree: false })
    // observer.disconnect() // TODO
  }

  trackByFn = () => false

  readonly fillTo = (num: number) => new Array<string>(num).fill('1fr ').reduce((acc, curr) => acc + curr, '').trimRight()
  readonly chunk = (size: number, collection: ReadonlyArray<any> = []) =>
    collection.reduce((acc, _, index) =>
      index % size === 0
        ? [...acc, collection.slice(index, index + size)]
        : acc, [])

  readonly calcNumRowsColumns = (n: number) => {
    const squared = Math.sqrt(n)
    const columns = Math.ceil(squared)
    const rows = columns
    const shouldFill = n === 2
    return {
      columns,
      rows,
      gridBoxColumns: shouldFill ? columns * 2 : columns,
      gridBoxRows: shouldFill ? columns * 2 : rows,
      shouldFill
    }
  }

  updateGridStyles(squareCount: number) {
    const gridCounts = this.calcNumRowsColumns(squareCount)
    const element = this.gridContainer.nativeElement
    const maxWidth = `${this.maxheight * 1.777777778}px`

    if (this.gridContainer) {
      this._rd.removeStyle(element, 'max-height')
      this._rd.setStyle(element, 'max-width', maxWidth)
      if (gridCounts.columns <= 1) {
        this._rd.setStyle(element, 'display', 'block')
      } else {
        const children = this.gridItemContainers.map(a => a.nativeElement)

        this._rd.setStyle(element, 'display', 'grid')
        this._rd.setStyle(element, 'grid-template-columns', this.fillTo(gridCounts.gridBoxColumns))
        this._rd.setStyle(element, 'grid-template-rows', this.fillTo(gridCounts.gridBoxRows))

        if (gridCounts.shouldFill) {
          this._rd.removeStyle(element, 'max-width')
          this._rd.setStyle(element, 'max-height', `${this.maxheight}px`)

          const groups = Math.ceil(children.length / gridCounts.columns) + 1

          this.chunk(groups, children).forEach((col, groupIdx) => {
            col.forEach((val, idx) => {
              this._rd.setStyle(val, 'grid-area', `${groupIdx * 2 + 2} / ${idx * 2 + 1} / span 2 / span 2`)
              this._rd.setStyle(val, 'align-self', 'center')
            })
          })
        } else {
          this._rd.setStyle(element, 'max-width', maxWidth)
          children.forEach(child => {
            this._rd.removeStyle(child, 'grid-area')
            this._rd.removeStyle(child, 'align-self')
          })
        }
      }
    }
  }
}
