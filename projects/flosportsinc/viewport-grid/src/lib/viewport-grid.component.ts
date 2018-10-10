import { maybe } from 'typescript-monads'
import { ViewportGridBoxComponent, GRID_BOX_SELECTOR_NAME } from './viewport-grid-box.component'
import { Subject } from 'rxjs'
import { takeUntil, map, distinctUntilChanged } from 'rxjs/operators'
import { IMaybe } from 'typescript-monads/interfaces'
import {
  Component, ContentChildren, ElementRef, QueryList, Renderer2,
  AfterContentInit, ViewChild, Input, ChangeDetectionStrategy, OnChanges, Output, OnDestroy
} from '@angular/core'

export interface ViewportGridBoxSelectedEvent<TElement = HTMLElement> {
  readonly selectedViewport: ViewportGridBoxComponent<TElement>
  readonly otherViewPorts: ReadonlyArray<ViewportGridBoxComponent<TElement>>
}

export interface ViewportGridBoxSelectedElementEvent<TElement = HTMLElement> {
  readonly selectedViewportElementGuid: string
  readonly selectedViewportElement: IMaybe<TElement>
  readonly otherViewPortElements: ReadonlyArray<IMaybe<ReadonlyArray<TElement>>>
}

const DEFAULT_MAX_HEIGHT = 900
const maxWidthFromHeight = (height: number) => 1.77 * height
const getGridTemplateColumns = (length: number) => Array.from(Array(length).keys()).map(() => '1fr').join(' ')
const computeColumns = (length: number) => Math.ceil(Math.sqrt(length))

const compareGuids =
  (x: ViewportGridBoxSelectedElementEvent, y: ViewportGridBoxSelectedElementEvent) =>
    x.selectedViewportElementGuid === y.selectedViewportElementGuid

const compareWraGuids =
  (x: ViewportGridBoxSelectedEvent, y: ViewportGridBoxSelectedEvent) =>
    x.selectedViewport.guid === y.selectedViewport.guid

const applyGridStyles =
  (style: string) =>
    (element: HTMLElement) =>
      (renderer: Renderer2) =>
        (length: number) =>
          renderer.setStyle(element, style, getGridTemplateColumns(computeColumns(length)))

const resetSelected =
  (arr: ViewportGridBoxComponent<HTMLElement>[]) =>
    arr.forEach(c => c.setSelected(false))

const setSelected =
  (arr: ViewportGridBoxComponent<HTMLElement>[]) =>
    (selectedViewport: ViewportGridBoxComponent) => {
      resetSelected(arr)
      selectedViewport.setSelected(true)
    }

const combineSelectionViews =
  (arr: ViewportGridBoxComponent<HTMLElement>[]) =>
    (selectedViewport: ViewportGridBoxComponent) => {
      const containerView = {
        selectedViewport,
        otherViewPorts: arr.filter(v => v.elementRef !== selectedViewport.elementRef)
      }
      return {
        containerView,
        elementView: {
          selectedViewportElementGuid: selectedViewport.guid,
          selectedViewportElement: selectedViewport.maybePanelItemElement(),
          otherViewPortElements: arr.filter(v => v.elementRef !== selectedViewport.elementRef).map(e => e.maybePanelItemElements())
        }
      }
    }

const emit =
  (paneSelectedSource: Subject<ViewportGridBoxSelectedEvent>) =>
    (paneElementSelectedSource: Subject<ViewportGridBoxSelectedElementEvent>) =>
      (arr: ViewportGridBoxComponent<HTMLElement>[]) =>
        (selectedViewport: ViewportGridBoxComponent) => {
          setSelected(arr)(selectedViewport)
          const grouped = combineSelectionViews(arr)(selectedViewport)
          paneSelectedSource.next(grouped.containerView)
          paneElementSelectedSource.next(grouped.elementView)
        }

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
  constructor(private renderer: Renderer2) { }

  private readonly paneSelectedSource$ = new Subject<ViewportGridBoxSelectedEvent>()
  private readonly paneElementSelectedSource$ = new Subject<ViewportGridBoxSelectedElementEvent>()
  private readonly ngDestroy$ = new Subject<ViewportGridBoxSelectedElementEvent>()

  @Input() public readonly maxHeight = DEFAULT_MAX_HEIGHT
  @Input() public readonly startingSelectedIndex = 0
  @Output() public readonly paneSelected$ = this.paneSelectedSource$.pipe(distinctUntilChanged(compareWraGuids))
  @Output() public readonly paneElementSelected$ = this.paneElementSelectedSource$.pipe(distinctUntilChanged(compareGuids))
  @ViewChild('gridContainer') private readonly _gridContainer?: ElementRef<HTMLDivElement>
  @ContentChildren(ViewportGridBoxComponent) private readonly _windowPanes?: QueryList<ViewportGridBoxComponent>

  private readonly _maybeContainer = () => maybe(this._gridContainer).map(ref => ref.nativeElement)
  private readonly _maybeChildren = () => maybe(this._windowPanes)
  private readonly _maybeImport = () => this._maybeContainer()
    .flatMap(container => this._maybeChildren()
      .map(children => {
        return {
          children,
          container
        }
      }))

  public readonly maybeGetSelectedItem =
    <TElement extends HTMLElement>(): IMaybe<ViewportGridBoxComponent<TElement>> =>
      this._maybeChildren()
        .flatMap(a => maybe(a.find(c => c.isSelected()) as ViewportGridBoxComponent<TElement>))

  private readonly _setNgStyle =
    (elm: HTMLElement) =>
      (style: string) =>
        (value: string) =>
          this.renderer.setStyle(elm, style, value)

  private readonly setContainerMaxWidth =
    (height: number) =>
      (elm: HTMLDivElement) =>
        this._setNgStyle(elm)('max-width')(`${maxWidthFromHeight(height)}px`)


  public readonly maybeGetSelectedElementItem =
    <TElement extends HTMLElement>(): IMaybe<TElement> =>
      this._maybeChildren()
        .flatMap(a => maybe(a.find(c => c.isSelected()) as ViewportGridBoxComponent<TElement>))
        .flatMap(a => a.maybePanelItemElement())

  public readonly maybeGetSelectedElementItems =
    <TElement extends HTMLElement>(): IMaybe<ReadonlyArray<TElement>> =>
      this._maybeChildren()
        .flatMap(a => maybe(a.find(c => c.isSelected()) as ViewportGridBoxComponent<TElement>))
        .flatMap(a => a.maybePanelItemElements())

  private readonly _renderGrid =
    (children: QueryList<ViewportGridBoxComponent>) =>
      (container: HTMLDivElement) => {
        const applyGridStyleByNumber =
          (count: number) =>
            (style: string) =>
              applyGridStyles(style)(container)(this.renderer)(count)

        if (children.length === 1) {
          this.renderer.removeStyle(container, 'grid-template-columns')
          this.renderer.removeStyle(container, 'grid-template-rows')
          this.renderer.removeStyle(container, 'max-height')
          this.setContainerMaxWidth(this.maxHeight)(container)
        } else if (children.length === 2) {
          this.renderer.setStyle(container, 'grid-template-columns', `1fr 1fr 1fr 1fr`)
          this.renderer.setStyle(container, 'grid-template-rows', `1fr 1fr 1fr 1fr`)
          this.renderer.setStyle(container.children[0], 'grid-row', `2 / span 2`)
          this.renderer.setStyle(container.children[1], 'grid-row', `2 / span 2`)
          this.renderer.setStyle(container.children[0], 'grid-column', `1 / span 2`)
          this.renderer.setStyle(container.children[1], 'grid-column', `3 / span 2`)
          this.renderer.setStyle(container.children[0], 'align-self', `center`)
          this.renderer.setStyle(container.children[1], 'align-self', `center`)
          this.renderer.setStyle(container, 'max-width', `${this.maxHeight * 3.55}px`)
          this.renderer.setStyle(container, 'max-height', `${this.maxHeight}px`)
        } else {
          Array.from(container.children).forEach(c => {
            this.renderer.removeStyle(c, 'grid-row')
            this.renderer.removeStyle(c, 'grid-column')
            this.renderer.removeStyle(c, 'align-self')
          })
          this.renderer.removeStyle(container, 'max-height')
          applyGridStyleByNumber(children.length)('grid-template-columns')
          applyGridStyleByNumber(children.length)('grid-template-rows')
          this.setContainerMaxWidth(this.maxHeight)(container)
        }
      }

  ngOnChanges() {
    this._maybeImport().tapSome(a => this._renderGrid(a.children)(a.container))
  }

  ngOnDestroy() {
    this.ngDestroy$.next()
    this.ngDestroy$.complete()
  }

  ngAfterContentInit() {
    this._maybeImport()
      .tapSome(obj => {
        const children = obj.children
        const arr = children.toArray()
        const push = emit(this.paneSelectedSource$)(this.paneElementSelectedSource$)

        arr.forEach(a => {
          // a.elementRef.nativeElement.addEventListener('dragstart', console.log)
          a.clicked$.pipe(takeUntil(obj.children.changes)).subscribe(push(arr))
        })

        if (!children.some(z => z.isSelected())) {
          // const index = this.startingSelectedIndex + 1 <= arr.length
          //   ? this.startingSelectedIndex
          //   : arr.length
          maybe(arr[0]).tapSome(dd => dd.setSelected(true))
        }

        this._renderGrid(children)(obj.container)

        // APPLY WHEN ELEMENTS SWAPPED IN AND OUT
        children.changes
          .pipe(
            takeUntil(this.ngDestroy$),
            map<any, ViewportGridBoxComponent<HTMLElement>[]>(a => a.toArray())
          )
          .subscribe(viewports => {
            viewports.forEach(z => z.clicked$
              .pipe(takeUntil(children.changes))
              .subscribe(push(viewports)))

            if (!viewports.some(z => z.isSelected())) {
              maybe(viewports.slice(-1)[0]).tapSome(dd => dd.setSelected(true))
            }

            this._renderGrid(children)(obj.container)
          })
      })
  }
}
