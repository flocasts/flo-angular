import {
  Component, ContentChildren, ElementRef, QueryList, Renderer2,
  AfterContentInit, ViewChild, Input, OnInit
} from '@angular/core'
import { WindowFrameDirective } from './window-frame.directive'

// Ideally, we only need @QueryChildren to query the transcluded nodes. The current solution
// relies on MutationObserver to watch these changes until the Angular issue is fixed.
// See this issue for more info: https://github.com/angular/angular/issues/12818

const getGridTemplateColumns = (length: number) => Array.from(Array(length).keys()).map(() => '1fr').join(' ')
const computeColumns = (length: number) => Math.ceil(Math.sqrt(length))
const applyGridStyles =
  (style: string) =>
    (element: HTMLElement) =>
      (renderer: Renderer2) =>
        (length: number) =>
          renderer.setStyle(element, style, getGridTemplateColumns(computeColumns(length)))

const wrap =
  (el: HTMLElement) =>
    (wrapper: HTMLElement) => {
      // tslint:disable-next-line:no-unused-expression
      el.parentNode && el.parentNode.insertBefore(wrapper, el)
      wrapper.appendChild(el)
    }

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
    #windowFrameContainer ::ng-deep > div {
      overflow: hidden;
      height: 0;
      padding-top: 56.25%;
      position: relative;
    }
    #windowFrameContainer ::ng-deep > div > * {
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
      <ng-content select="[floWindowFrame]"></ng-content>
    </div>
  `,
})
export class WindowFrameComponent implements AfterContentInit, OnInit {
  @Input() maxHeight = 900
  @ViewChild('windowFrameContainer') windowFrameContainer: ElementRef<HTMLDivElement>
  @ContentChildren(WindowFrameDirective, { read: ElementRef }) children: QueryList<ElementRef<HTMLDivElement>>

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    const maxWidth = 1.77 * this.maxHeight
    this.renderer.setStyle(this.windowFrameContainer.nativeElement, 'max-width', `${maxWidth}px`)
  }

  ngAfterContentInit() {
    const applyGridStyleByNumber =
      (count: number) =>
        (style: string) =>
          applyGridStyles(style)(this.windowFrameContainer.nativeElement)(this.renderer)(count)

    applyGridStyleByNumber(this.children.length)('grid-template-columns')

    // wrap all elements in a selection box div
    this.children.forEach(a => {
      const elm = this.renderer.createElement('div')
      wrap(a.nativeElement)(elm)
    })

    applyGridStyleByNumber(this.children.length)('grid-template-rows')

    // TODO: cleanup
    if (this.children.length === 2) {
      this.renderer.removeStyle(this.windowFrameContainer.nativeElement, 'max-width')
      this.renderer.setStyle(this.windowFrameContainer.nativeElement, 'max-height', `${this.maxHeight}px`)
      this.renderer.setStyle(this.windowFrameContainer.nativeElement, 'grid-template-columns', `1fr 1fr 1fr 1fr`)
      this.renderer.setStyle(this.windowFrameContainer.nativeElement, 'grid-template-rows', `1fr 1fr 1fr 1fr`)
      this.renderer.setStyle(this.windowFrameContainer.nativeElement.children[0], 'grid-row', `2 / span 2`)
      this.renderer.setStyle(this.windowFrameContainer.nativeElement.children[1], 'grid-row', `2 / span 2`)
      this.renderer.setStyle(this.windowFrameContainer.nativeElement.children[0], 'grid-column', `1 / span 2`)
      this.renderer.setStyle(this.windowFrameContainer.nativeElement.children[1], 'grid-column', `3 / span 2`)
      this.renderer.setStyle(this.windowFrameContainer.nativeElement.children[0], 'align-self', `center`)
      this.renderer.setStyle(this.windowFrameContainer.nativeElement.children[1], 'align-self', `center`)
    }

    // TODO: cleanup/finish this logic
    const observer = new MutationObserver(a => {
      a.forEach(v => {
        const approviedElements = Array.from((v.target as HTMLDivElement).children).filter(z => z.hasAttribute('floWindowFrame'))
        applyGridStyleByNumber(approviedElements.length)('grid-template-columns')

        if (approviedElements.length >= 3) {
          applyGridStyleByNumber(approviedElements.length)('grid-template-rows')
          this.renderer.addClass(this.windowFrameContainer.nativeElement, 'windowFrameContainer-multi')
          if (approviedElements.length === 2) {
            this.renderer.addClass(this.windowFrameContainer.nativeElement, 'wfc-col-2')
          }
        } else {
          this.renderer.removeClass(this.windowFrameContainer.nativeElement, 'windowFrameContainer-multi')
          this.renderer.addClass(this.windowFrameContainer.nativeElement, 'wfc-col-2')
        }
      })
    })
    const config = { attributes: false, childList: true, subtree: false }
    observer.observe(this.windowFrameContainer.nativeElement, config)
  }
}
