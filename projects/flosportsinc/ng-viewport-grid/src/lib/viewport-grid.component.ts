import { maybe } from 'typescript-monads'
import { ViewportGridBoxComponent, GRID_BOX_SELECTOR_NAME } from './viewport-grid-box.component'
import { Subject, combineLatest, BehaviorSubject } from 'rxjs'
import { takeUntil, map, distinctUntilChanged, debounceTime } from 'rxjs/operators'
import { IMaybe } from 'typescript-monads/interfaces'
import {
  Component, ContentChildren, ElementRef, QueryList, Renderer2,
  AfterContentInit, ViewChild, Input, ChangeDetectionStrategy, OnChanges, Output, OnDestroy, ChangeDetectorRef
} from '@angular/core'

export interface ViewportGridBoxSelectedEvent<TElement = HTMLElement> {
  readonly selectedIndex: number
  readonly selectedViewport: ViewportGridBoxComponent<TElement>
  readonly otherViewPorts: ReadonlyArray<ViewportGridBoxComponent<TElement>>
}

export interface ViewportGridBoxSelectedElementEvent<TElement = HTMLElement> {
  readonly selectedIndex: number
  readonly selectedViewportElementGuid: string
  readonly selectedViewportElement: IMaybe<TElement>
  readonly otherViewPortElements: ReadonlyArray<IMaybe<ReadonlyArray<TElement>>>
}

interface CombinedView {
  readonly children: QueryList<ViewportGridBoxComponent<HTMLElement>>
  readonly container: HTMLDivElement
}

const DEFAULT_MAX_HEIGHT = 900
const maxWidthFromHeight = (height: number) => 1.77 * height
const getGridTemplateColumns = (length: number) => Array.from(Array(length).keys()).map(() => '1fr').join(' ')
const computeColumns = (length: number) => Math.ceil(Math.sqrt(length))

export const compareGuids =
  (x: ViewportGridBoxSelectedElementEvent, y: ViewportGridBoxSelectedElementEvent) =>
    x.selectedViewportElementGuid === y.selectedViewportElementGuid

export const compareWrappedGuids =
  (x: ViewportGridBoxSelectedEvent, y: ViewportGridBoxSelectedEvent) =>
    x.selectedViewport.guid === y.selectedViewport.guid

const applyGridStyles =
  (style: string) =>
    (element: HTMLElement) =>
      (renderer: Renderer2) =>
        (length: number) =>
          renderer.setStyle(element, style, getGridTemplateColumns(computeColumns(length)))


const combineSelectionViews =
  (arr: ReadonlyArray<ViewportGridBoxComponent<HTMLElement>>) =>
    (selectedViewport: ViewportGridBoxComponent) =>
      (selectedIndex: number) => {
        const containerView = {
          selectedIndex,
          selectedViewport,
          otherViewPorts: arr.filter(v => v.elementRef !== selectedViewport.elementRef)
        }
        return {
          containerView,
          elementView: {
            selectedIndex,
            selectedViewportElementGuid: selectedViewport.guid,
            selectedViewportElement: selectedViewport.maybePanelItemElement(),
            otherViewPortElements: arr.filter(v => v.elementRef !== selectedViewport.elementRef).map(e => e.maybePanelItemElements())
          }
        }
      }

const getPreSelectedIndex =
  (supposedIndex: number) =>
    (elementCount: number) =>
      supposedIndex <= 0 || supposedIndex >= elementCount
        ? 0
        : supposedIndex

@Component({
  selector: 'flo-viewport-grid',
  styles: [`
    :host {
      display: block;
      background: black;
    }
    #gridContainer {
      display: grid;
      margin: auto;
    }
    #gridContainer ::ng-deep > ${GRID_BOX_SELECTOR_NAME} > * {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  `],
  template: `
    <div #gridContainer id="gridContainer">
      <ng-content select="${GRID_BOX_SELECTOR_NAME}"></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportGridComponent implements AfterContentInit, OnChanges, OnDestroy {
  constructor(private _renderer: Renderer2) { }

  @Input() public readonly maxHeight = DEFAULT_MAX_HEIGHT
  @Input() public readonly startingSelectedIndex = 0

  private readonly itemSource = new Subject<ReadonlyArray<ViewportGridBoxComponent>>()
  private readonly itemSelectedSource = new Subject<ViewportGridBoxSelectedEvent>()
  private readonly itemElementSelectedSource = new Subject<ViewportGridBoxSelectedElementEvent>()
  private readonly ngDestroy$ = new Subject<ViewportGridBoxSelectedElementEvent>()

  @Output() public readonly items$ = this.itemSource.asObservable()
  @Output() public readonly itemSelected$ = this.itemSelectedSource.pipe(debounceTime(1), distinctUntilChanged(compareWrappedGuids))
  @Output() public readonly itemElementSelected$ = this.itemElementSelectedSource.pipe(debounceTime(1), distinctUntilChanged(compareGuids))

  @ViewChild('gridContainer') private readonly _gridContainer?: ElementRef<HTMLDivElement>
  @ContentChildren(ViewportGridBoxComponent) private readonly _windowPanes?: QueryList<ViewportGridBoxComponent>

  private readonly _maybeContainer = () => maybe(this._gridContainer).map(ref => ref.nativeElement)
  private readonly _maybeChildren = () => maybe(this._windowPanes)
  private readonly _maybeCombinedView = () => this._maybeContainer()
    .flatMap(container => this._maybeChildren()
      .map<CombinedView>(children => {
        return {
          children,
          container
        }
      }))

  // tslint:disable-next-line:readonly-keyword
  private selectedIndex!: number

  // tslint:disable-next-line: no-object-mutation
  private readonly setSelectedIndex = (num: number) => this.selectedIndex = num

  public readonly maybeGetSelectedItem =
    <TElement extends HTMLElement>(): IMaybe<ViewportGridBoxComponent<TElement>> =>
      this._maybeChildren()
        .flatMap(a => maybe(a.find(c => c.isSelected()) as ViewportGridBoxComponent<TElement>))

  private readonly _setNgStyle =
    (elm: HTMLElement) =>
      (style: string) =>
        (value: string) =>
          this._renderer.setStyle(elm, style, value)

  private readonly _setContainerMaxWidth =
    (height: number) =>
      (elm: HTMLDivElement) =>
        this._setNgStyle(elm)('max-width')(`${maxWidthFromHeight(height)}px`)

  public readonly maybeGetSelectedElementItem =
    <TElement extends HTMLElement>(): IMaybe<TElement> =>
      this._maybeChildren()
        .flatMapAuto(a => a.find(c => c.isSelected()) as ViewportGridBoxComponent<TElement>)
        .flatMap(a => a.maybePanelItemElement())

  public readonly maybeGetSelectedElementItems =
    <TElement extends HTMLElement>(): IMaybe<ReadonlyArray<TElement>> =>
      this._maybeChildren()
        .flatMapAuto(a => a.find(c => c.isSelected()) as ViewportGridBoxComponent<TElement>)
        .flatMap(a => a.maybePanelItemElements())

  private readonly _setGridStyles =
    (combined: CombinedView) => {
      const applyGridStyleByNumber =
        (count: number) =>
          (style: string) =>
            applyGridStyles(style)(combined.container)(this._renderer)(count)

      const removeElementStyle = (elm: HTMLElement) => (style: string) => this._renderer.removeStyle(elm, style)
      const removeContainerStyle = (style: string) => removeElementStyle(combined.container)(style)
      const setElementStyle = (elm: HTMLElement) => (style: string) => (value: string) => this._renderer.setStyle(elm, style, value)
      const setElementStyleContainer = (style: string) => (value: string) => setElementStyle(combined.container)(style)(value)

      // tslint:disable-next-line:no-if-statement
      if (combined.children.length === 1) {
        removeContainerStyle('grid-template-columns')
        removeContainerStyle('grid-template-rows')
        removeContainerStyle('max-height')
        this._setContainerMaxWidth(this.maxHeight)(combined.container)
        // tslint:disable-next-line:no-if-statement
      } else if (combined.children.length === 2) {
        const child0 = setElementStyle(combined.container.children[0] as HTMLElement)
        const child1 = setElementStyle(combined.container.children[1] as HTMLElement)

        setElementStyleContainer('grid-template-columns')(`1fr 1fr 1fr 1fr`)
        setElementStyleContainer('grid-template-rows')(`1fr 1fr 1fr 1fr`)
        setElementStyleContainer('max-width')(`${this.maxHeight * 3.55}px`)
        setElementStyleContainer('max-height')(`${this.maxHeight}px`)
        child0('grid-row')(`2 / span 2`)
        child0('align-self')(`center`)
        child0('grid-column')(`1 / span 2`)
        child1('grid-row')(`2 / span 2`)
        child1('grid-column')(`3 / span 2`)
        child1('align-self')(`center`)
      } else {
        Array.from(combined.container.children).forEach(c => {
          this._renderer.removeStyle(c, 'grid-row')
          this._renderer.removeStyle(c, 'grid-column')
          this._renderer.removeStyle(c, 'align-self')
        })
        this._renderer.removeStyle(combined.container, 'max-height')
        applyGridStyleByNumber(combined.children.length)('grid-template-columns')
        applyGridStyleByNumber(combined.children.length)('grid-template-rows')
        this._setContainerMaxWidth(this.maxHeight)(combined.container)
      }
    }

  ngOnChanges() {
    this._maybeCombinedView().tapSome(a => this._setGridStyles(a))
  }

  ngOnDestroy() {
    this.ngDestroy$.next()
    this.ngDestroy$.complete()
  }

  readonly resetSelected =
    (arr: ReadonlyArray<ViewportGridBoxComponent<HTMLElement>>) =>
      arr.forEach(c => c.setSelected(false))

  readonly setSelected =
    (arr: ReadonlyArray<ViewportGridBoxComponent<HTMLElement>>) =>
      (selectedViewport: ViewportGridBoxComponent) => {
        this.resetSelected(arr)
        selectedViewport.setSelected(true)
      }

  readonly emit =
    (itemSource: Subject<ReadonlyArray<ViewportGridBoxComponent>>) =>
      (paneSelectedSource: Subject<ViewportGridBoxSelectedEvent>) =>
        (paneElementSelectedSource: Subject<ViewportGridBoxSelectedElementEvent>) =>
          (arr: ReadonlyArray<ViewportGridBoxComponent<HTMLElement>>) =>
            (selectedIndex: number) =>
              (selectedViewport: ViewportGridBoxComponent) => {
                this.setSelected(arr)(selectedViewport)
                const grouped = combineSelectionViews(arr)(selectedViewport)(selectedIndex)
                paneSelectedSource.next(grouped.containerView)
                paneElementSelectedSource.next(grouped.elementView)
                itemSource.next(arr)
              }

  private readonly _push = this.emit(this.itemSource)(this.itemSelectedSource)(this.itemElementSelectedSource)

  private readonly _updateOnChanges = (combined: CombinedView) => {
    combined.children.changes
      .pipe(
        takeUntil(this.ngDestroy$),
        map<any, ReadonlyArray<ViewportGridBoxComponent<HTMLElement>>>(a => a.toArray())
      )
      .subscribe(viewports => {
        viewports[this.selectedIndex].setSelected(true)

        // tslint:disable-next-line:no-if-statement
        // if (!viewports.some(z => z.isSelected())) {
        //   maybe(viewports.slice(-1)[0]).tapSome(dd => dd.setSelected(true))
        // }

        viewports.forEach((z, idx) => z.clicked$
          .pipe(takeUntil(combined.children.changes))
          .subscribe(this._push(viewports)(idx)))

        maybe(viewports.find(a => a.isSelected()))
          .map(viewport => {
            return {
              index: viewports.findIndex(b => b.guid === viewport.guid),
              viewport
            }
          }).tapSome(res => this._push(viewports)(res.index)(res.viewport))

        this._setGridStyles(combined)
      })
  }

  ngAfterContentInit() {
    this.itemSelected$
      .pipe(takeUntil(this.ngDestroy$))
      .subscribe(item => this.setSelectedIndex(item.selectedIndex))

    this._maybeCombinedView()
      .tapSome(obj => {
        const arr = obj.children.toArray()

        arr.forEach((a, idx) => {
          a.clicked$.pipe(takeUntil(obj.children.changes)).subscribe(this._push(arr)(idx))
        })

        const index = getPreSelectedIndex(+this.startingSelectedIndex)(obj.children.length)
        maybe(arr[index]).tapSome(dd => {
          dd.setSelected(true)
          this._push(arr)(index)(dd)
        })

        this._setGridStyles(obj)
        this._updateOnChanges(obj)
      })
  }
}
