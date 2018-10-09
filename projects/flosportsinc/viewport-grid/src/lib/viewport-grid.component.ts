import { maybe } from 'typescript-monads'
import { ViewportGridBoxComponent, GRID_BOX_SELECTOR_NAME } from './viewport-grid-box.component'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import {
  Component, ContentChildren, ElementRef, QueryList, Renderer2,
  AfterContentInit, ViewChild, Input, ChangeDetectionStrategy, OnChanges, Output
} from '@angular/core'
import { IMaybe } from 'typescript-monads/interfaces'

export interface ViewportGridBoxSelectedEvent<TElement = HTMLElement> {
  readonly selectedViewport: ViewportGridBoxComponent<TElement>
  readonly otherViewPorts: ReadonlyArray<ViewportGridBoxComponent<TElement>>
}

export interface ViewportGridBoxSelectedElementEvent<TElement = HTMLElement> {
  readonly selectedViewportElement: IMaybe<TElement>
  readonly otherViewPortElements: ReadonlyArray<IMaybe<ReadonlyArray<TElement>>>
}

const DEFAULT_MAX_HEIGHT = 900

const maxWidthFromHeight = (height: number) => 1.77 * height
const getGridTemplateColumns = (length: number) => Array.from(Array(length).keys()).map(() => '1fr').join(' ')
const computeColumns = (length: number) => Math.ceil(Math.sqrt(length))
const applyGridStyles =
  (style: string) =>
    (element: HTMLElement) =>
      (renderer: Renderer2) =>
        (length: number) =>
          renderer.setStyle(element, style, getGridTemplateColumns(computeColumns(length)))

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
export class ViewportGridComponent implements AfterContentInit, OnChanges {
  @Input() readonly maxHeight = DEFAULT_MAX_HEIGHT
  @Output() readonly paneSelected = new Subject<ViewportGridBoxSelectedEvent>()
  @Output() readonly paneElementSelected = new Subject<ViewportGridBoxSelectedElementEvent>()
  @ViewChild('gridContainer') readonly gridContainer?: ElementRef<HTMLDivElement>
  @ContentChildren(ViewportGridBoxComponent) readonly windowPanes?: QueryList<ViewportGridBoxComponent>

  readonly maybeContainer = () => maybe(this.gridContainer).map(ref => ref.nativeElement)
  readonly maybeChildren = () => maybe(this.windowPanes)
  readonly maybeImport = () => this.maybeContainer()
    .flatMap(container => this.maybeChildren()
      .map(children => {
        return {
          children,
          container
        }
      }))

  readonly setNgStyle =
    (elm: HTMLElement) =>
      (style: string) =>
        (value: string) =>
          this.renderer.setStyle(elm, style, value)

  readonly maybeSetContainerStyle =
    () =>
      this.maybeContainer().map(this.setNgStyle)

  readonly setContainerMaxWidth =
    (height: number) =>
      (elm: HTMLDivElement) =>
        this.setNgStyle(elm)('max-width')(`${maxWidthFromHeight(height)}px`)

  constructor(private renderer: Renderer2) { }

  ngOnChanges() {
    this.maybeImport().tapSome(a => this.tryer(a))
  }

  readonly tryer = (obj: {
    children: QueryList<ViewportGridBoxComponent>
    container: HTMLDivElement;
  }) => {
    const applyGridStyleByNumber =
      (count: number) =>
        (style: string) =>
          applyGridStyles(style)(obj.container)(this.renderer)(count)

    if (obj.children.length === 1) {
      this.renderer.removeStyle(obj.container, 'grid-template-columns')
      this.renderer.removeStyle(obj.container, 'grid-template-rows')
      this.renderer.removeStyle(obj.container, 'max-height')
      this.setContainerMaxWidth(this.maxHeight)(obj.container)
    } else if (obj.children.length === 2) {
      this.renderer.setStyle(obj.container, 'grid-template-columns', `1fr 1fr 1fr 1fr`)
      this.renderer.setStyle(obj.container, 'grid-template-rows', `1fr 1fr 1fr 1fr`)
      this.renderer.setStyle(obj.container.children[0], 'grid-row', `2 / span 2`)
      this.renderer.setStyle(obj.container.children[1], 'grid-row', `2 / span 2`)
      this.renderer.setStyle(obj.container.children[0], 'grid-column', `1 / span 2`)
      this.renderer.setStyle(obj.container.children[1], 'grid-column', `3 / span 2`)
      this.renderer.setStyle(obj.container.children[0], 'align-self', `center`)
      this.renderer.setStyle(obj.container.children[1], 'align-self', `center`)
      this.renderer.setStyle(obj.container, 'max-width', `${this.maxHeight * 3.55}px`)
      this.renderer.setStyle(obj.container, 'max-height', `${this.maxHeight}px`)
    } else {
      Array.from(obj.container.children).forEach(c => {
        this.renderer.removeStyle(c, 'grid-row')
        this.renderer.removeStyle(c, 'grid-column')
        this.renderer.removeStyle(c, 'align-self')
      })
      this.renderer.removeStyle(obj.container, 'max-height')
      applyGridStyleByNumber(obj.children.length)('grid-template-columns')
      applyGridStyleByNumber(obj.children.length)('grid-template-rows')
      this.setContainerMaxWidth(this.maxHeight)(obj.container)
    }
  }

  // CLEANUP
  ngAfterContentInit() {
    this.maybeImport()
      .tapSome(obj => {
        obj.children.forEach(a => {
          a.clicked$.pipe(takeUntil(obj.children.changes)).subscribe(selectedViewport => {
            obj.children.forEach(c => c.setSelected(false))
            selectedViewport.setSelected(true)
            const grouped = {
              selectedViewport,
              otherViewPorts: obj.children.toArray().filter(v => v.elementRef !== selectedViewport.elementRef)
            }
            this.paneSelected.next(grouped)
            const d = grouped.otherViewPorts.map(z => z.maybePanelItemElements())
            this.paneElementSelected.next({
              selectedViewportElement: grouped.selectedViewport.maybePanelItemElement(),
              otherViewPortElements: grouped.otherViewPorts.map(e => e.maybePanelItemElements())
            })
          })
        })

        this.tryer(obj)
        obj.children.changes.subscribe((d: QueryList<ViewportGridBoxComponent>) => {
          d.toArray().forEach(z => {
            z.clicked$
              .pipe(takeUntil(obj.children.changes))
              .subscribe(selectedViewport => {
                obj.children.forEach(c => c.setSelected(false))
                selectedViewport.setSelected(true)
                const grouped = {
                  selectedViewport,
                  otherViewPorts: obj.children.toArray().filter(v => v.elementRef !== selectedViewport.elementRef)
                }
                this.paneSelected.next(grouped)
                this.paneElementSelected.next({
                  selectedViewportElement: grouped.selectedViewport.maybePanelItemElement(),
                  otherViewPortElements: grouped.otherViewPorts.map(e => e.maybePanelItemElements())
                })
              })
          })
          this.tryer(obj)
        })
      })
  }
}
