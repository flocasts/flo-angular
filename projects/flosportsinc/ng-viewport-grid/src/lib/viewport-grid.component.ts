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
  (arr: ReadonlyArray<ViewportGridBoxComponent<HTMLElement>>) =>
    arr.forEach(c => c.setSelected(false))

const setSelected =
  (arr: ReadonlyArray<ViewportGridBoxComponent<HTMLElement>>) =>
    (selectedViewport: ViewportGridBoxComponent) => {
      resetSelected(arr)
      selectedViewport.setSelected(true)
    }

const combineSelectionViews =
  (arr: ReadonlyArray<ViewportGridBoxComponent<HTMLElement>>) =>
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
      (arr: ReadonlyArray<ViewportGridBoxComponent<HTMLElement>>) =>
        (selectedViewport: ViewportGridBoxComponent) => {
          setSelected(arr)(selectedViewport)
          const grouped = combineSelectionViews(arr)(selectedViewport)
          paneSelectedSource.next(grouped.containerView)
          paneElementSelectedSource.next(grouped.elementView)
        }

const getPreSelectedIndex =
  (supposedIndex: number) =>
    (elementCount: number) =>
      supposedIndex <= 0 || supposedIndex >= elementCount
        ? 0
        : supposedIndex

const swapContainers =
  (element: HTMLElement) => {
    maybe(element.parentNode)
      .tapSome(parent => {
        parent.insertBefore(element, parent.firstChild)
      })
  }

const dragStart = (ev: DragEvent) => {
  maybe(ev.dataTransfer)
    .flatMap(dataTransfer => maybe(ev.target).map(target => {
      return {
        dataTransfer,
        target
      }
    }))
    .tapSome(res => {
      // res.dataTransfer.dropEffect = 'move'
      res.dataTransfer.setData('text/plain', (res.target as any).id)
    })
}

const dragOverHandler =
  (parent: ViewportGridBoxComponent<HTMLElement>) =>
    (ev: DragEvent) => {
      ev.preventDefault()
      maybe(ev.target)
        .tapSome((target: any) => {
          const d = target as HTMLElement
          // tslint:disable-next-line:no-object-mutation
          d.style.border = '0px 0px 0px 3px yellow'
          // parent.set
          parent.setDropStyles()
        })
    }

const dropHandler =
  (parent: ViewportGridBoxComponent<HTMLElement>) =>
    (ev: DragEvent) => {
      ev.preventDefault()
      maybe(ev.dataTransfer).tapSome(dt => {
        // tslint:disable-next-line:no-object-mutation
        dt.dropEffect = 'link'
        const data = dt.getData('text')
        maybe(ev.target)
          .tapSome(() => {
            const elm = document.getElementById(data)
            // tslint:disable-next-line:no-if-statement
            if (elm) {
              // swapContainers(elm)
              // (ev.target as HTMLElement).appendChild(elm)
            }
          })
      })
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

  private readonly itemSelectedSource$ = new Subject<ViewportGridBoxSelectedEvent>()
  private readonly itemElementSelectedSource$ = new Subject<ViewportGridBoxSelectedElementEvent>()
  private readonly ngDestroy$ = new Subject<ViewportGridBoxSelectedElementEvent>()

  @Input() public readonly maxHeight = DEFAULT_MAX_HEIGHT
  @Input() public readonly startingSelectedIndex = 0
  @Output() public readonly itemSelected$ = this.itemSelectedSource$.pipe(distinctUntilChanged(compareWraGuids))
  @Output() public readonly itemElementSelected$ = this.itemElementSelectedSource$.pipe(distinctUntilChanged(compareGuids))
  @ViewChild('gridContainer') private readonly _gridContainer?: ElementRef<HTMLDivElement>
  @ContentChildren(ViewportGridBoxComponent) private readonly _windowPanes?: QueryList<ViewportGridBoxComponent>

  private readonly _maybeContainer = () => maybe(this._gridContainer).map(ref => ref.nativeElement)
  private readonly _maybeChildren = () => maybe(this._windowPanes)
  private readonly _maybeCombinedView = () => this._maybeContainer()
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

  private readonly _setContainerMaxWidth =
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

  private readonly _setGridStyles =
    (children: QueryList<ViewportGridBoxComponent>) =>
      (container: HTMLDivElement) => {
        const applyGridStyleByNumber =
          (count: number) =>
            (style: string) =>
              applyGridStyles(style)(container)(this.renderer)(count)

        const removeElementStyle = (elm: HTMLElement) => (style: string) => this.renderer.removeStyle(elm, style)
        const removeContainerStyle = (style: string) => removeElementStyle(container)(style)
        const setElementStyle = (elm: HTMLElement) => (style: string) => (value: string) => this.renderer.setStyle(elm, style, value)
        const setElementStyleContainer = (style: string) => (value: string) => setElementStyle(container)(style)(value)

        // tslint:disable-next-line:no-if-statement
        if (children.length === 1) {
          removeContainerStyle('grid-template-columns')
          removeContainerStyle('grid-template-rows')
          removeContainerStyle('max-height')
          this._setContainerMaxWidth(this.maxHeight)(container)
          // tslint:disable-next-line:no-if-statement
        } else if (children.length === 2) {
          const child0 = setElementStyle(container.children[0] as HTMLElement)
          const child1 = setElementStyle(container.children[1] as HTMLElement)

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
          Array.from(container.children).forEach(c => {
            this.renderer.removeStyle(c, 'grid-row')
            this.renderer.removeStyle(c, 'grid-column')
            this.renderer.removeStyle(c, 'align-self')
          })
          this.renderer.removeStyle(container, 'max-height')
          applyGridStyleByNumber(children.length)('grid-template-columns')
          applyGridStyleByNumber(children.length)('grid-template-rows')
          this._setContainerMaxWidth(this.maxHeight)(container)
        }
      }

  ngOnChanges() {
    this._maybeCombinedView().tapSome(a => this._setGridStyles(a.children)(a.container))
  }

  ngOnDestroy() {
    this.ngDestroy$.next()
    this.ngDestroy$.complete()
  }

  ngAfterContentInit() {
    this._maybeCombinedView()
      .tapSome(obj => {
        const children = obj.children
        const arr = children.toArray()
        const push = emit(this.itemSelectedSource$)(this.itemElementSelectedSource$)

        arr.forEach(a => {
          a.elementRef.nativeElement.addEventListener('dragstart', dragStart)
          a.elementRef.nativeElement.addEventListener('dragover', dragOverHandler(a))
          a.elementRef.nativeElement.addEventListener('drop', dropHandler(a))
          a.clicked$.pipe(takeUntil(obj.children.changes)).subscribe(push(arr))
        })

        // tslint:disable-next-line:no-if-statement
        if (!children.some(z => z.isSelected())) {
          const index = getPreSelectedIndex(+this.startingSelectedIndex)(children.length)
          maybe(arr[index]).tapSome(dd => dd.setSelected(true))
        }

        this._setGridStyles(children)(obj.container)

        // APPLY WHEN ELEMENTS SWAPPED IN AND OUT
        children.changes
          .pipe(
            takeUntil(this.ngDestroy$),
            map<any, ReadonlyArray<ViewportGridBoxComponent<HTMLElement>>>(a => a.toArray())
          )
          .subscribe(viewports => {
            viewports.forEach(z => z.clicked$
              .pipe(takeUntil(children.changes))
              .subscribe(push(viewports)))

            // tslint:disable-next-line:no-if-statement
            if (!viewports.some(z => z.isSelected())) {
              maybe(viewports.slice(-1)[0]).tapSome(dd => dd.setSelected(true))
            }

            this._setGridStyles(children)(obj.container)
          })
      })
  }
}
