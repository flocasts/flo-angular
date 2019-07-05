// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword
// tslint:disable: no-if-statement

import { isPlatformServer, isPlatformBrowser } from '@angular/common'
import { maybe, IMaybe } from 'typescript-monads'
import { chunk, swapItemsViaIndices } from './helpers'
import { Subject, fromEvent, of, interval, merge, BehaviorSubject } from 'rxjs'
import { map, startWith, mapTo, share, switchMapTo, tap, distinctUntilChanged, takeUntil, shareReplay, debounceTime } from 'rxjs/operators'
import { FloGridListOverlayDirective, FloGridListItemNoneDirective, FloGridListItemSomeDirective } from './grid.directive'
import {
  Component, ChangeDetectionStrategy, Input, Output, Inject, PLATFORM_ID, ElementRef, ContentChild,
  TemplateRef, ViewChild, ViewChildren, QueryList, AfterViewInit, OnDestroy, OnInit, ChangeDetectorRef,
  HostListener, OnChanges, SimpleChanges
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
  FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY,
  FLO_GRID_LIST_ASPECT_RATIO
} from '../ng-grid-list.tokens'

export interface IViewItem<T> {
  readonly value?: T
  readonly hasValue: boolean
  readonly flexBasis: number
  readonly padTop: number
  readonly isShowingBorder: boolean
  readonly isSelected: boolean
  readonly isNotSelected: boolean
}

@Component({
  selector: 'flo-grid-list-view',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloGridListViewComponent<TItem extends IFloGridListBaseItem> implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  constructor(
    public elmRef: ElementRef<HTMLElement>,
    private _cdRef: ChangeDetectorRef,
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
    @Inject(FLO_GRID_LIST_DRAG_DROP_ENABLED) private _dragDropEnabled: boolean,
    @Inject(FLO_GRID_LIST_ASPECT_RATIO) private _aspectRatio: number
  ) { }

  @HostListener('fullscreenchange')
  @HostListener('webkitfullscreenchange')
  @HostListener('mozfullscreenchange')
  @HostListener('MSFullscreenChange')
  fullscreenchange() {
    this.update()
  }

  @Input()
  get items() {
    return this._items as ReadonlyArray<TItem | undefined>
  }
  set items(items: ReadonlyArray<TItem | undefined>) {
    this._items = items
    this.itemsChange.next(items)
    this._cdRef.markForCheck()
  }

  public setItems(items: ReadonlyArray<TItem | undefined>) {
    this.items = items
    this.setSelectedIdViaIndex(this.selectedIndex)
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
  get shouldSelectNextEmpty() {
    return this._shouldSelectNextEmpty
  }
  set shouldSelectNextEmpty(val: boolean) {
    this._shouldSelectNextEmpty = val
    this.shouldSelectNextEmptyChange.next(val)
  }

  public setShouldSelectNextEmpty(val: boolean) {
    this.shouldSelectNextEmpty = val
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
    this.setSelectedIdViaIndex(index)
  }

  private _selectedId?: string

  @Input()
  get selectedId() {
    return this._selectedId
  }
  set selectedId(id: string | undefined) {
    this._selectedId = id
    this.selectedIdChange.next(id)
  }

  public setSelectedId(id?: string) {
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

  @Input()
  get aspectRatio() {
    return this._aspectRatio
  }
  set aspectRatio(ratio: number) {
    const _ratio = typeof ratio === 'number' ? ratio : this._aspectRatio
    this._aspectRatio = _ratio
    this.aspectRatioChange.next(_ratio)
  }

  public setAspectRatio(percent: number) {
    this.aspectRatio = percent
  }

  public readonly isFullscreen = () => isPlatformBrowser(this._platformId) ? 1 >= window.outerHeight - window.innerHeight : false

  get baseMaxWidth() {
    return this.maxheight / this.aspectRatio
  }

  get maxWidth() {
    return this.count === 2 ? 'none' : this.baseMaxWidth + 'px'
  }

  get aspectRatioPercentage() {
    return this.aspectRatio * 100
  }

  get top() {
    return this.count === 2
      ? this.isIE11
        ? '25%'
        : 'inherit'
      : this.isFullscreen
        ? 'inhert'
        : '0px'
  }

  private readonly viewItemSource = new BehaviorSubject<ReadonlyArray<IViewItem<TItem>>>([])

  @Output() public readonly itemsChange = new Subject<ReadonlyArray<TItem | undefined>>()
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
  @Output() public readonly shouldSelectNextEmptyChange = new Subject<boolean>()
  @Output() public readonly aspectRatioChange = new Subject<number>()
  @Output() public readonly cdRefChange = merge(this.selectedIdChange, this.selectedIndexChange, this.itemsChange, this.countChange)
  @Output() public readonly viewItemChange = this.viewItemSource.asObservable().pipe(shareReplay(1))

  @ViewChild('floGridListContainer') readonly gridContainer: ElementRef<HTMLDivElement>
  @ViewChildren('floGridListItemContainer') readonly gridItemContainers: QueryList<ElementRef<HTMLDivElement>>

  @ContentChild(FloGridListItemSomeDirective, { read: TemplateRef }) readonly gridListItemSomeTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloGridListItemNoneDirective, { read: TemplateRef }) readonly gridListItemNoneTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloGridListOverlayDirective, { read: TemplateRef }) readonly gridListOverlayTemplate: TemplateRef<HTMLElement>

  private cursorInsideElement = merge(
    fromEvent(this.elmRef.nativeElement, 'mousemove').pipe(mapTo(true), tap(() => this.cycleOverlay())),
    fromEvent(this.elmRef.nativeElement, 'mouseenter').pipe(mapTo(true)),
    fromEvent(this.elmRef.nativeElement, 'mouseleave').pipe(mapTo(false))
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

  private toggleCursor = (show: boolean) => this.elmRef.nativeElement.style.cursor = show ? 'default' : 'none'

  public readonly trySelectNextEmpty = () =>
    maybe(this.viewItemSource.getValue().slice(0, this.count).findIndex((b: any) => !b.hasValue))
      .filter(idx => idx >= 0)
      .tapSome(idx => this.setSelectedIndex(idx))

  private readonly setSelectedIdViaIndex = (idx: number) => {
    this.setSelectedId(maybe(this.items[idx]).map(a => a.id).valueOrUndefined())
    this.cycleOverlay()
  }

  public readonly cycleOverlay = () => {
    this.fadeoutIntervalReset.next(true)
    this._cdRef.markForCheck()
  }

  createViewItems = () => {
    const square = Math.ceil(Math.sqrt(this.count))

    const stub = new Array<IMaybe<TItem>>(this.count)
      .fill(maybe())
      .map((val, idx) => this.items[idx] ? maybe(this.items[idx]) : val)

    return stub.map<IViewItem<TItem>>((value, idx) => {
      const isSelected = this.selectedIndex === idx
      return {
        hasValue: value.isSome(),
        value: value.valueOrUndefined(),
        flexBasis: 100 / square,
        padTop: this.aspectRatioPercentage / square,
        isShowingBorder: isSelected && this.count > 1,
        isSelected,
        isNotSelected: !isSelected
      }
    })
  }

  update() {
    this.viewItemSource.next(this.createViewItems())
  }

  ngOnInit() {
    // initial setup of selected id
    this.setSelectedIdViaIndex(this.selectedIndex)
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this._platformId)) {
      this.fadeStream.pipe(takeUntil(this.onDestroy)).subscribe(show => this.toggleCursor(show))
      this.cdRefChange.pipe(takeUntil(this.onDestroy)).subscribe(() => this.update())
    }
  }

  ngOnChanges(_change: SimpleChanges) {
    this.update()
  }

  ngOnDestroy() {
    this.onDestroySource.next()
    this.onDestroySource.complete()
  }

  readonly trackByFn = (_idx: number, _item: TItem) => _item && _item.id

  readonly setItemAtIndex = (idx: number, val: TItem) => {
    // tslint:disable-next-line: readonly-array
    const _cloned = [...this.items]
    _cloned[idx] = val
    this.setItems(_cloned)
  }

  readonly swapItemsAtIndex = (toIndex: number, toVal: TItem, fromIndex?: number) => typeof fromIndex === 'number'
    ? this.setItems(swapItemsViaIndices(this.items, toIndex, fromIndex))
    : this.setItemAtIndex(toIndex, toVal)

  public readonly setValueOfSelected = (val: TItem) => this.setItemAtIndex(this.selectedIndex, val)

  public readonly getItemIndexById = (id: string) => this.items.findIndex(a => a !== undefined && a.id === id)
  public readonly getItemIndex = (item: TItem) => this.getItemIndexById(item.id)
  public readonly isCount = (count: number) => this.count === count
  public readonly isIdSelected = (id: string) => this.selectedId === id
  public readonly isIdNotSelected = (id: string) => !this.isIdSelected(id)
  public readonly isItemSelected = (item: TItem) => this.selectedId === item.id
  public readonly isItemNotSelected = (item: TItem) => !this.isItemSelected(item)
  public readonly isItemInView = (item: TItem) => {
    const itemIndex = this.getItemIndex(item)
    return itemIndex >= 0 && itemIndex <= this.count
  }

  public readonly isItemInGrid = (item: TItem) => this.getItemIndex(item) >= 0
  public readonly isItemNotInGrid = (item: TItem) => !this.isItemInGrid(item)
  public readonly isItemInAnotherIndex = (item: TItem, idx: number) => maybe(this.getItemIndex(item))
    .filter(i => i >= 0)
    .filter(i => i !== idx)
    .map(() => true)
    .valueOr(false)

  public readonly isItemInNotAnotherIndex = (item: TItem, idx: number) => !this.isItemInAnotherIndex(item, idx)

  public readonly canRemoveItem = (item: TItem) => this.isItemInGrid(item)
  public readonly canRemoveItemSelected = (item: TItem) => this.isItemSelected(item)
  public readonly canSwapItem =
    (item: TItem, toIndex = this.selectedIndex) =>
      this.isItemInAnotherIndex(item, toIndex)

  public readonly isIndexEmpty = (idx: number) => this.items[idx] === undefined

  public readonly canSelectItem =
    (item: TItem) =>
      this.isItemInView(item) && this.isItemNotSelected(item)

  public readonly canAddItem =
    (item: TItem, toIndex = this.selectedIndex) =>
      this.isIndexEmpty(toIndex) && this.isItemInNotAnotherIndex(item, toIndex)

  public readonly canReplaceItem = (item: TItem, toIndex = this.selectedIndex) => {
    return this.isItemNotSelected(item) && !this.canAddItem(item, toIndex)
  }

  public readonly setItem = (item: TItem, idx = this.selectedIndex) => this.setItemAtIndex(idx, item)

  public readonly removeItem =
    (item: TItem) =>
      maybe(this.getItemIndexById(item.id))
        .filter(idx => idx >= 0)
        .tapSome(idx => this.setItems([...this.items.slice(0, idx), undefined, ...this.items.slice(idx + 1)]))

  public readonly replaceItem = (item: TItem, idx = this.selectedIndex) => {
    const previousIndex = this.getItemIndex(item)
    // tslint:disable-next-line: readonly-array
    const _cloned = [...this.items]

    _cloned[idx] = item
    _cloned[previousIndex] = undefined

    this.setItems(_cloned)
  }

  public readonly swapItems = (item: TItem, idx = this.selectedIndex) => {
    this.setItems(swapItemsViaIndices(this.items, idx, this.getItemIndex(item)))
  }

  public readonly resetItems = () => {
    this.items = []
    this.setSelectedId(undefined)
  }

  public readonly findNextEmptyIndex = () => this.viewItemSource.getValue().findIndex((a: any) => !a.hasValue)

  public readonly fillNextEmpty =
    (item: TItem) =>
      maybe(this.findNextEmptyIndex())
        .filter(idx => idx >= 0)
        .tapSome(idx => this.setItem(item, idx))

  private isIE11 = typeof window !== 'undefined' && !!(window as any).MSInputMethodContext && !!(document as any).documentMode
}
