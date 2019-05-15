// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword
// tslint:disable: no-if-statement

import { isPlatformServer, isPlatformBrowser } from '@angular/common'
import { maybe, IMaybe } from 'typescript-monads'
import { swapAtIndex, fillWith, chunk } from './helpers'
import { Subject, fromEvent, of, interval, merge } from 'rxjs'
import { map, startWith, mapTo, share, switchMapTo, tap, distinctUntilChanged, takeUntil, shareReplay } from 'rxjs/operators'
import { FloGridListOverlayDirective, FloGridListItemNoneDirective, FloGridListItemSomeDirective } from './grid.directive'
import {
  Component, ChangeDetectionStrategy, Input, Output, Inject, PLATFORM_ID, ElementRef, ContentChild,
  TemplateRef, ViewChild, ViewChildren, QueryList, Renderer2, AfterViewInit, OnDestroy
} from '@angular/core'
import {
  FLO_GRID_LIST_COUNT,
  FLO_GRID_LIST_MIN_COUNT,
  FLO_GRID_LIST_MAX_COUNT,
  FLO_GRID_LIST_OVERLAY_ENABLED,
  FLO_GRID_LIST_OVERLAY_FADEOUT,
  FLO_GRID_LIST_OVERLAY_THROTTLE,
  FLO_GRID_LIST_OVERLAY_NG_CLASS,
  FLO_GRID_LIST_OVERLAY_NG_STYLE,
  FLO_GRID_LIST_MAX_HEIGHT,
  FLO_GRID_LIST_SELECTED_INDEX,
  FLO_GRID_LIST_OVERLAY_START,
  FLO_GRID_LIST_OVERLAY_STATIC,
  FLO_GRID_LIST_ITEMS,
  FLO_GRID_LIST_DRAG_DROP_ENABLED,
  IFloGridListBaseItem,
  FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY
} from '../ng-grid-list.tokens'

@Component({
  selector: 'flo-grid-list-view',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloGridTilesComponent<TItem extends IFloGridListBaseItem> implements AfterViewInit, OnDestroy {
  constructor(
    private _elmRef: ElementRef<HTMLElement>,
    private _rd: Renderer2,
    @Inject(PLATFORM_ID) private _platformId: string,
    @Inject(FLO_GRID_LIST_ITEMS) private _items: any,
    @Inject(FLO_GRID_LIST_COUNT) private _count: number,
    @Inject(FLO_GRID_LIST_MIN_COUNT) private _min: number,
    @Inject(FLO_GRID_LIST_MAX_COUNT) private _max: number,
    @Inject(FLO_GRID_LIST_MAX_HEIGHT) private _maxHeight: number,
    @Inject(FLO_GRID_LIST_SELECTED_INDEX) private _selectedIndex: number,
    @Inject(FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY) private _shouldSelectNextEmpty: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_ENABLED) private _overlayEnabled: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_START) private _overlayStart: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_FADEOUT) private _overlayFadeout: number,
    @Inject(FLO_GRID_LIST_OVERLAY_THROTTLE) private _overlayThrottle: number,
    @Inject(FLO_GRID_LIST_OVERLAY_STATIC) private _overlayStatic: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_NG_CLASS) private _overlayNgClass: Object,
    @Inject(FLO_GRID_LIST_OVERLAY_NG_STYLE) private _overlayNgStyle: Object,
    @Inject(FLO_GRID_LIST_DRAG_DROP_ENABLED) private _dragDropEnabled: boolean
  ) { }

  @Input()
  get items() {
    return this._items as ReadonlyArray<TItem>
  }
  set items(items: ReadonlyArray<TItem>) {
    this._items = items
    this.itemsChange.next(items)
  }

  public setItems(items: ReadonlyArray<TItem>) {
    this.items = items
  }

  @Input()
  get count() {
    return this._count
  }
  set count(val: number) {
    if (val >= this._min && val <= this._max) {
      this._count = val
      this.countChange.next(this._count)
    }

    if (this.selectedIndex >= val) { // Ensure seletedIndex doesn't go out of bounds visually
      this.setSelectedIndex(0)
    } else if (this._shouldSelectNextEmpty) {
      this.trySelectNextEmpty()
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
  get selectedIndex() {
    return this._selectedIndex
  }
  set selectedIndex(index: number) {
    if (index >= 0 && index < this.count) {
      this._selectedIndex = index
      this.selectedIndexChange.next(index)
    }
  }

  public setSelectedIndex(index: number) {
    this.selectedIndex = index
  }

  private _selectedId: string

  @Input()
  get selectedId() {
    return this._selectedId
  }
  set selectedId(id: string) {
    this._selectedId = id
    this.selectedIdChange.next(id)
  }

  public setSelectedId(id: string) {
    this.selectedId = id
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
  get overlayStatic() {
    return this._overlayStatic
  }
  set overlayStatic(isStatic: boolean) {
    this._overlayStatic = isStatic
    this.overlayStaticChange.next(isStatic)
  }

  public setOverlayStatic(isStatic: boolean) {
    this.overlayStatic = isStatic
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

  @Input()
  get dragDropEnabled() {
    return this._dragDropEnabled
  }
  set dragDropEnabled(enabled: boolean) {
    this._dragDropEnabled = enabled
    this.dragDropEnabledChange.next(enabled)
  }

  public setDragDropEnabled(enabled: boolean) {
    this.dragDropEnabled = enabled
  }

  get viewItems() {
    return new Array<IMaybe<TItem>>(this.count)
      .fill(maybe())
      .map((val, idx) => this.items[idx] ? maybe(this.items[idx]) : val)
      .map((value, idx) => {
        const isSelected = this.selectedIndex === idx
        return {
          hasValue: value.isSome(),
          value: value.valueOrUndefined(),
          isShowingBorder: isSelected && this.count > 1,
          isSelected,
          isNotSelected: !isSelected
        }
      })
  }

  @Output() public readonly itemsChange = new Subject<ReadonlyArray<TItem>>()
  @Output() public readonly countChange = new Subject<number>()
  @Output() public readonly minChange = new Subject<number>()
  @Output() public readonly maxChange = new Subject<number>()
  @Output() public readonly maxheightChange = new Subject<number>()
  @Output() public readonly selectedIdChange = new Subject<string>()
  @Output() public readonly selectedIndexChange = new Subject<number>()
  @Output() public readonly overlayEnabledChange = new Subject<boolean>()
  @Output() public readonly overlayStaticChange = new Subject<boolean>()
  @Output() public readonly overlayStartChange = new Subject<boolean>()
  @Output() public readonly overlayFadeoutChange = new Subject<number>()
  @Output() public readonly overlayThrottleChange = new Subject<number>()
  @Output() public readonly overlayNgClassChange = new Subject<Object>()
  @Output() public readonly overlayNgStyleChange = new Subject<Object>()
  @Output() public readonly dragDropEnabledChange = new Subject<boolean>()

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
  private readonly onDestroySource = new Subject()
  private readonly onDestroy = this.onDestroySource.pipe(share())

  public readonly fadeStream = (isPlatformServer(this._platformId)
    ? of(false)
    : merge(this.cursorInsideElement, this.fadeoutIntervalWithReset)
  ).pipe(distinctUntilChanged(), shareReplay(1))

  public readonly showOverlay = this.overlayEnabled ? this.fadeStream : of(false)
  public readonly hideOverlay = this.showOverlay.pipe(map(show => !show))

  private toggleCursor = (show: boolean) => this._elmRef.nativeElement.style.cursor = show ? 'initial' : 'none'

  public readonly trySelectNextEmpty = () => {
    maybe(this.viewItems.slice(0, this.count).findIndex(b => !b.hasValue))
      .filter(idx => idx >= 0)
      .tapSome(idx => this.setSelectedIndex(idx))
  }

  ngAfterViewInit() {
    this.updateGridStyles(this.gridItemContainers.length)

    if (isPlatformBrowser(this._platformId)) {
      this.fadeStream.pipe(takeUntil(this.onDestroy)).subscribe(show => this.toggleCursor(show))
      this.gridItemContainers.changes.pipe(takeUntil(this.onDestroy)).subscribe(a => this.updateGridStyles(a.length))
    }
  }

  ngOnDestroy() {
    this.onDestroySource.next()
    this.onDestroySource.complete()
  }

  readonly trackByFn = (_idx: number, _item: TItem) => false

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

  readonly setValueAtIndex = (idx: number, val: TItem) => {
    typeof idx === 'number' && this.setItems(swapAtIndex(this.items, idx, val))
  }

  readonly swapItemsAtIndex = (toIndex: number, toVal: TItem, fromIndex?: number, fromVal?: TItem) => {
    const firstPass = swapAtIndex(this.items, toIndex, toVal)

    if (typeof fromIndex === 'number' && fromVal) {
      this.setItems(swapAtIndex(firstPass, fromIndex, fromVal))
    } else {
      this.setItems(firstPass)
    }
  }

  readonly setValueOfSelected = (val: TItem) => {
    this.setItems(swapAtIndex(this.items, this.selectedIndex, val))
  }

  readonly updateGridStyles = (count: number) => {
    const gridCounts = this.calcNumRowsColumns(count)
    const element = this.gridContainer.nativeElement
    const maxWidth = `${this.maxheight * 1.777777778}px`
    const maxWidthKey = 'max-width'
    const maxHeightKey = 'max-height'
    const displayKey = 'display'
    const gridAreaKey = 'grid-area'
    const alignSelfKey = 'align-self'

    if (this.gridContainer) {
      this._rd.removeStyle(element, maxHeightKey)
      this._rd.setStyle(element, maxWidthKey, maxWidth)
      if (gridCounts.columns <= 1) {
        this._rd.setStyle(element, displayKey, 'block')
      } else {
        const children = this.gridItemContainers.map(a => a.nativeElement)

        this._rd.setStyle(element, displayKey, 'grid')
        this._rd.setStyle(element, 'grid-template-columns', fillWith(gridCounts.gridBoxColumns, '1fr '))
        this._rd.setStyle(element, 'grid-template-rows', fillWith(gridCounts.gridBoxRows, '1fr '))

        if (gridCounts.shouldFill) {
          this._rd.removeStyle(element, maxWidthKey)
          this._rd.setStyle(element, maxHeightKey, `${this.maxheight}px`)

          const groups = Math.ceil(children.length / gridCounts.columns) + 1

          chunk(groups, children).forEach((col, groupIdx) => {
            col.forEach((val, idx) => {
              this._rd.setStyle(val, gridAreaKey, `${groupIdx * 2 + 2} / ${idx * 2 + 1} / span 2 / span 2`)
              this._rd.setStyle(val, alignSelfKey, 'center')
            })
          })
        } else {
          this._rd.setStyle(element, maxWidthKey, maxWidth)
          children.forEach(child => {
            this._rd.removeStyle(child, gridAreaKey)
            this._rd.removeStyle(child, alignSelfKey)
          })
        }
      }
    }
  }
}
