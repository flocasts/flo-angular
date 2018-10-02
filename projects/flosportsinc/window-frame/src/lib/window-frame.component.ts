import {
  Component, ContentChildren, ElementRef, QueryList, Renderer2,
  AfterContentInit, ViewChild, Input, ChangeDetectionStrategy, OnChanges
} from '@angular/core'
import { maybe } from 'typescript-monads'
import { WindowPaneComponent } from './window-pane.component'

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
  selector: 'flo-window-frame',
  styles: [`
    :host {
      display: block;
      background: black;
    }
    #windowFrameContainer {
      display: grid;
      margin: auto;
    }
    #windowFrameContainer ::ng-deep > flo-window-pane > * {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `],
  template: `
    <div #windowFrameContainer id="windowFrameContainer">
      <ng-content select="flo-window-pane"></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowFrameComponent implements AfterContentInit, OnChanges {
  @Input() maxHeight = 900
  @ViewChild('windowFrameContainer') windowFrameContainer?: ElementRef<HTMLDivElement>
  @ContentChildren(WindowPaneComponent, { read: ElementRef }) children?: QueryList<ElementRef<HTMLDivElement>>

  readonly maybeContainer = () => maybe(this.windowFrameContainer).map(ref => ref.nativeElement)
  readonly maybeChildren = () => maybe(this.children)
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

  tryer(obj: {
    children: QueryList<ElementRef<HTMLDivElement>>
    container: HTMLDivElement;
  }) {
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

  ngAfterContentInit() {
    this.maybeImport()
      .tapSome(obj => {
        this.tryer(obj)
        obj.children.changes.subscribe(() => {
          this.tryer(obj)
        })
      })
  }
}
