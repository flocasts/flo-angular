// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword

import { isPlatformServer } from '@angular/common'
import { maybe, IMaybe } from 'typescript-monads'
import { swapItemsViaIndices } from './helpers'
import { Subject, fromEvent, of, interval, merge, BehaviorSubject, Observable } from 'rxjs'
import {
  map, startWith, mapTo, share, switchMapTo, tap, distinctUntilChanged,
  takeUntil, shareReplay, take
} from 'rxjs/operators'
import {
  FloGridListOverlayDirective, FloGridListItemNoneDirective,
  FloGridListItemSomeDirective, FloGridListItemSomeDragDirective, FloGridListItemNoneDragDirective
} from './grid.directive'
import {
  Component, ChangeDetectionStrategy, Input, Output, Inject, PLATFORM_ID, ElementRef, ContentChild,
  TemplateRef, ViewChild, ViewChildren, QueryList, OnDestroy, OnInit, ChangeDetectorRef,
  HostListener, AfterViewInit, TrackByFunction, Renderer2, NgZone
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
  FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT,
  FLO_GRID_LIST_ASPECT_RATIO,
  FLO_GRID_LIST_TRACK_BY_FN,
  FLO_GRID_LIST_CONTAINER_ID_PREFIX,
  FLO_GRID_LIST_FILL_TO_FIT,
  FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD,
  IFloGridListBaseItem,
  FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST,
  FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED,
  FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR,
  FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY
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

export type ITrackByFn<TItem extends IFloGridListBaseItem = IFloGridListBaseItem> = TrackByFunction<IViewItem<TItem>>

@Component({
  selector: 'flo-grid-list-view',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloGridListViewComponent<TItem extends IFloGridListBaseItem> implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public elmRef: ElementRef<HTMLElement>,
    private cdRef: ChangeDetectorRef,
    private rd: Renderer2,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private _platformId: string,
    @Inject(FLO_GRID_LIST_ITEMS) private _items: any,
    @Inject(FLO_GRID_LIST_COUNT) private _count: number,
    @Inject(FLO_GRID_LIST_MIN_COUNT) private _min: number,
    @Inject(FLO_GRID_LIST_MAX_COUNT) private _max: number,
    @Inject(FLO_GRID_LIST_MAX_HEIGHT) private _maxHeight: number,
    @Inject(FLO_GRID_LIST_SELECTED_INDEX) private _selectedIndex: number,
    @Inject(FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT) private _selectNextEmptyOnCount: boolean,
    @Inject(FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD) private _selectNextEmptyOnAdd: boolean,
    @Inject(FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST) private _selectFromLowerIndicesFirst: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_ENABLED) private _overlayEnabled: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_START) private _overlayStart: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_FADEOUT) private _overlayFadeout: number,
    @Inject(FLO_GRID_LIST_OVERLAY_THROTTLE) private _overlayThrottle: number,
    @Inject(FLO_GRID_LIST_OVERLAY_STATIC) private _overlayStatic: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_NG_CLASS) private _overlayNgClass: Object,
    @Inject(FLO_GRID_LIST_OVERLAY_NG_STYLE) private _overlayNgStyle: Object,
    @Inject(FLO_GRID_LIST_DRAG_DROP_ENABLED) private _dragDropEnabled: boolean,
    @Inject(FLO_GRID_LIST_ASPECT_RATIO) private _aspectRatio: number,
    @Inject(FLO_GRID_LIST_TRACK_BY_FN) private _trackByFn: TrackByFunction<IViewItem<TItem>>,
    @Inject(FLO_GRID_LIST_CONTAINER_ID_PREFIX) private _containerIdPrefix: string,
    @Inject(FLO_GRID_LIST_FILL_TO_FIT) private _fillToFit: boolean,
    @Inject(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED) private _dragDropHoverBgEnabled: boolean,
    @Inject(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR) private _dragDropHoverBgColor: string,
    @Inject(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY) private _dragDropHoverBgOpacity: string | number
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
    } else if (this.selectNextEmptyOnCount) {
      this.trySelectNextEmpty()
    }
  }

  public setCount(count: number) {
    this.count = count
  }

  @Input()
  get min() {
    return this._min
  }
  set min(val: number) {
    this._min = val
    this.minChange.next(this._min)
    if (this.count < val) {
      this.setCount(val)
    }
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
    if (this.count > val) {
      this.setCount(val)
    }
  }

  public setMax(min: number) {
    this.max = min
  }

  @Input()
  get selectNextEmptyOnCount() {
    return this._selectNextEmptyOnCount
  }
  set selectNextEmptyOnCount(val: boolean) {
    this._selectNextEmptyOnCount = val
    this.selectNextEmptyOnCountChange.next(val)
  }

  public setSelectNextEmptyOnCount(val: boolean) {
    this.selectNextEmptyOnCount = val
  }

  @Input()
  get selectNextEmptyOnAdd() {
    return this._selectNextEmptyOnAdd
  }
  set selectNextEmptyOnAdd(val: boolean) {
    this._selectNextEmptyOnAdd = val
    this.selectNextEmptyOnAddChange.next(val)
  }

  public setSelectNextEmptyOnAdd(val: boolean) {
    this.selectNextEmptyOnAdd = val
  }

  @Input()
  get selectFromLowerIndicesFirst() {
    return this._selectFromLowerIndicesFirst
  }
  set selectFromLowerIndicesFirst(val: boolean) {
    this._selectFromLowerIndicesFirst = val
    this.selectFromLowerIndicesFirstChange.next(val)
  }

  public setSelectFromLowerIndicesFirst(val: boolean) {
    this.selectFromLowerIndicesFirst = val
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

  public setSelectedIndex = (index: number) => {
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

  @Input()
  get trackByFn() {
    return this._trackByFn
  }
  set trackByFn(fn: ITrackByFn<TItem>) {
    const _fn = typeof fn === 'function' ? fn : this._trackByFn
    this._trackByFn = _fn
    this.trackByFnChange.next(_fn)
  }

  public setTrackByFn(fn: ITrackByFn<TItem>) {
    this.trackByFn = fn
  }

  @Input()
  get containerIdPrefix() {
    return this._containerIdPrefix
  }
  set containerIdPrefix(prefix: string) {
    this._containerIdPrefix = prefix
    this.containerIdPrefixChange.next(prefix)
  }

  public setContainerIdPrefix(prefix: string) {
    this.containerIdPrefix = prefix
  }

  @Input()
  get fillToFit() {
    return this._fillToFit
  }
  set fillToFit(enable: boolean) {
    this._fillToFit = enable
    this.fillToFitChange.next(enable)
  }

  public setFillToFit(enable: boolean) {
    this.fillToFit = enable
  }

  @Input()
  get dragDropHoverBgEnabled() {
    return this._dragDropHoverBgEnabled
  }
  set dragDropHoverBgEnabled(enable: boolean) {
    this._dragDropHoverBgEnabled = enable
    this.dragDropHoverBgEnabledChange.next(enable)
  }

  public setDragDropHoverBgEnabled(enable: boolean) {
    this.dragDropHoverBgEnabled = enable
  }

  @Input()
  get dragDropHoverBgColor() {
    return this._dragDropHoverBgColor
  }
  set dragDropHoverBgColor(style: string) {
    this._dragDropHoverBgColor = style
    this.dragDropHoverBgColorChange.next(style)
  }

  public setDragDropHoverBgColor(style: string) {
    this.dragDropHoverBgColor = style
  }

  @Input()
  get dragDropHoverBgOpacity() {
    return this._dragDropHoverBgOpacity
  }
  set dragDropHoverBgOpacity(val: string | number) {
    this._dragDropHoverBgOpacity = val
    this.dragDropHoverBgOpacityChange.next(val)
  }

  public setDragDropHoverBgOpacity(val: string) {
    this.dragDropHoverBgOpacity = val
  }

  public readonly isFullscreen = () => isPlatformServer(this._platformId) ? false : 1 >= window.outerHeight - window.innerHeight

  get baseMaxWidth() {
    return this.maxheight / this.aspectRatio
  }

  get maxWidth() {
    return this.count === 2 ? 'none' : this.baseMaxWidth + 'px'
  }

  get aspectRatioPct() {
    return this.aspectRatio * 100
  }

  private readonly viewItemSource = new BehaviorSubject<ReadonlyArray<IViewItem<TItem>>>([])

  @Output() public readonly itemsChange = new Subject<ReadonlyArray<TItem | undefined>>()
  @Output() public readonly countChange = new Subject<number>()
  @Output() public readonly minChange = new Subject<number>()
  @Output() public readonly maxChange = new Subject<number>()
  @Output() public readonly maxheightChange = new Subject<number>()
  @Output() public readonly selectedIdChange = new Subject<string>()
  @Output() public readonly selectedIndexChange = new Subject<number>()
  @Output() public readonly selectedElementChange = new Subject<HTMLElement>()
  @Output() public readonly overlayEnabledChange = new Subject<boolean>()
  @Output() public readonly overlayStaticChange = new Subject<boolean>()
  @Output() public readonly overlayStartChange = new Subject<boolean>()
  @Output() public readonly overlayFadeoutChange = new Subject<number>()
  @Output() public readonly overlayThrottleChange = new Subject<number>()
  @Output() public readonly overlayNgClassChange = new Subject<Object>()
  @Output() public readonly overlayNgStyleChange = new Subject<Object>()
  @Output() public readonly dragDropEnabledChange = new Subject<boolean>()
  @Output() public readonly dragDropHoverBgEnabledChange = new Subject<boolean>()
  @Output() public readonly dragDropHoverBgColorChange = new Subject<string>()
  @Output() public readonly dragDropHoverBgOpacityChange = new Subject<string | number>()
  @Output() public readonly selectNextEmptyOnCountChange = new Subject<boolean>()
  @Output() public readonly selectNextEmptyOnAddChange = new Subject<boolean>()
  @Output() public readonly selectFromLowerIndicesFirstChange = new Subject<boolean>()
  @Output() public readonly aspectRatioChange = new Subject<number>()
  @Output() public readonly trackByFnChange = new Subject<ITrackByFn<TItem>>()
  @Output() public readonly containerIdPrefixChange = new Subject<string>()
  @Output() public readonly fillToFitChange = new Subject<boolean>()
  @Output() public readonly cdRefChange = merge(this.selectedIdChange, this.selectedIndexChange, this.itemsChange, this.countChange)
  @Output() public readonly viewItemChange = this.viewItemSource.asObservable().pipe(shareReplay(1))

  @ViewChildren('floGridListItemContainer') readonly gridItemContainers: QueryList<ElementRef<HTMLDivElement>>

  @ContentChild(FloGridListItemSomeDirective, { read: TemplateRef }) readonly gridListItemSomeTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloGridListItemNoneDirective, { read: TemplateRef }) readonly gridListItemNoneTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloGridListItemSomeDragDirective, { read: TemplateRef }) readonly gridListItemSomeDragTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloGridListItemNoneDragDirective, { read: TemplateRef }) readonly gridListItemNoneDragTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloGridListOverlayDirective, { read: TemplateRef }) readonly gridListOverlayTemplate: TemplateRef<HTMLElement>

  public dragSource = new Subject<DragEvent>()
  private readonly onDestroySource = new Subject()
  private readonly onDestroy = this.onDestroySource.pipe(share())

  private cursorInsideElement = this.zone.runOutsideAngular(() => merge(
    this.dragSource.pipe(mapTo(true), tap(() => this.cycleOverlay())),
    fromEvent(this.elmRef.nativeElement, 'mousemove').pipe(mapTo(true), tap(() => this.cycleOverlay())),
    fromEvent(this.elmRef.nativeElement, 'mouseenter').pipe(mapTo(true)),
    fromEvent(this.elmRef.nativeElement, 'mouseleave').pipe(mapTo(false))
  ).pipe(startWith(this.overlayStart), distinctUntilChanged()))

  private readonly fadeoutIntervalReset = new Subject<boolean>()
  private readonly stableFadeoutInterval = this.zone.runOutsideAngular(() =>
    interval(this.overlayFadeout).pipe(mapTo(false), startWith(this.overlayStart), takeUntil(this.onDestroy)))

  private readonly fadeoutIntervalWithReset = this.fadeoutIntervalReset.pipe(startWith(false), switchMapTo(this.stableFadeoutInterval))

  public readonly fadeStream = (isPlatformServer(this._platformId)
    ? of(this.overlayEnabled)
    : merge(this.cursorInsideElement, this.fadeoutIntervalWithReset)
  ).pipe(distinctUntilChanged(), shareReplay(1))

  public readonly showOverlay = this.fadeStream.pipe(map(b => this.overlayEnabled && b))
  public readonly hideOverlay = this.showOverlay.pipe(map(show => !show), shareReplay(1))

  private readonly toggleCursor = (show: boolean) => this.rd.setStyle(this.elmRef.nativeElement, 'cursor', show ? 'default' : 'none')
  public readonly trySelectNextEmpty = () => this.findNextEmptyIndex().tapSome(this.setSelectedIndex)

  private readonly setSelectedIdViaIndex = (idx: number) => {
    this.setSelectedId(maybe(this.items[idx]).map(a => a.id).valueOrUndefined())
    this.cycleOverlay()
  }

  public readonly cycleOverlay = () => {
    this.fadeoutIntervalReset.next(true)
    this.cdRef.markForCheck()
  }

  readonly constructContainerId = (token: string | number) => `${this.containerIdPrefix}${token}`

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
        padTop: this.aspectRatioPct / square,
        isShowingBorder: isSelected && this.count > 1,
        isSelected,
        isNotSelected: !isSelected,
        containerId: value.map(i => i.id)
          .map(this.constructContainerId)
          .valueOr(this.constructContainerId(idx))
      }
    })
  }

  update = () => {
    this.viewItemSource.next(this.createViewItems())
    this.cdRef.detectChanges()
  }

  ngOnInit() {
    const takeByPlatform = <T>(source: Observable<T>) => isPlatformServer(this._platformId)
      ? source.pipe(take(1))
      : source.pipe(takeUntil(this.onDestroy))

    this.fadeStream.pipe(takeByPlatform).subscribe(this.toggleCursor)
    this.cdRefChange.pipe(takeByPlatform).subscribe(this.update)
  }

  ngAfterViewInit() {
    // initial setup of selected ID
    this.setSelectedIdViaIndex(this.selectedIndex)

    if (isPlatformServer(this._platformId)) { return }

    merge(this.selectedIndexChange, this.itemsChange.pipe(map(() => this.selectedIndex))).pipe(
      startWith(this.selectedIndex),
      map(idx => maybe(this.gridItemContainers.toArray()[idx]).flatMapAuto(a => a.nativeElement)),
      map(e => e
        .flatMapAuto(elm => Array.from(elm.children)
          .find(a => a.classList.contains('list-item-some') || a.classList.contains('list-item-none')))
        .flatMapAuto(a => {
          return {
            id: e.flatMapAuto(b => b.id).filter(b => b !== '').valueOrUndefined(),
            elm: a.children.item(0)
          }
        })),
      distinctUntilChanged((x, y) => x.flatMapAuto(b => b.id).valueOrUndefined() === y.flatMapAuto(b => b.id).valueOrUndefined()),
      takeUntil(this.onDestroy)
    ).subscribe(maybeElement => maybeElement.map(a => a.elm).tapSome((val: HTMLElement) => this.selectedElementChange.next(val)))
  }

  ngOnDestroy() {
    this.onDestroySource.next()
    this.onDestroySource.complete()
  }

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

  public readonly canReplaceItem =
    (item: TItem, toIndex = this.selectedIndex) =>
      this.isItemNotSelected(item) && !this.canAddItem(item, toIndex)

  public readonly setItem =
    (item: TItem, idx = this.selectedIndex) => {
      this.setItemAtIndex(idx, item)
      if (this.selectNextEmptyOnAdd) {
        this.trySelectNextEmpty()
      }
    }

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

  public readonly swapItems =
    (item: TItem, idx = this.selectedIndex) =>
      this.setItems(swapItemsViaIndices(this.items, idx, this.getItemIndex(item)))

  public readonly resetItems = () => {
    this.items = []
    this.setSelectedId(undefined)
  }

  // TODO: TEST THIS SCENARIO!
  public readonly findNextEmptyIndex = () => {
    const findByBaseIndex = (startIndex = 0) => maybe(this.viewItemSource.getValue()
      .slice(startIndex, this.count)
      .findIndex(b => !b.hasValue))
      .filter(idx => idx >= 0)
      .map(a => a + startIndex)

    return this.selectFromLowerIndicesFirst
      ? findByBaseIndex()
      : findByBaseIndex(this.selectedIndex).match({ some: maybe, none: findByBaseIndex })
  }

  public readonly fillNextEmpty =
    (item: TItem) =>
      this.findNextEmptyIndex()
        .tapSome(idx => this.setItem(item, idx))
}
