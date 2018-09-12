import { Component, ContentChildren, ElementRef, QueryList, Renderer2, AfterContentInit, ChangeDetectorRef } from '@angular/core'
import { WindowFrameDirective } from './window-frame.directive'

// Ideally, we only need @QueryChildren to query the transcluded nodes. The current solution
// relies on MutationObserver to watch these changes until the Angular issue is fixed.
// See this error for more info: https://github.com/angular/angular/issues/12818

const getGridTemplateColumns = (length: number) => Array.from(Array(length).keys()).map(() => '1fr').join(' ')
const computeLimit = (length: number) => Math.ceil(Math.sqrt(length))
const applyGridStyles =
  (style: string) =>
    (element: HTMLElement) =>
      (renderer: Renderer2) =>
        (length: number) =>
          renderer.setStyle(element, style, getGridTemplateColumns(computeLimit(length)))

@Component({
  selector: 'flo-window-frame',
  styles: [`
    :host {
      background-color: green;
      display: grid;
      height: inherit;
      margin: auto;
      max-width: 1500px;
    }
    :host ::ng-deep > * {
      max-width: 100%;
      max-height: 100%;
      align-self: center;
      justify-self: center;
    }
  `],
  template: `
    <ng-content select="[floWindowFrame]"></ng-content>
  `,
})
export class WindowFrameComponent implements AfterContentInit {
  @ContentChildren(WindowFrameDirective) children: QueryList<WindowFrameDirective>

  constructor(private elRef: ElementRef<HTMLDivElement>, private renderer: Renderer2, private cd: ChangeDetectorRef) { }

  ngAfterContentInit() {
    const applyGridStyleByNumber =
      (count: number) =>
        (style: string) =>
          applyGridStyles(style)(this.elRef.nativeElement)(this.renderer)(count)

    applyGridStyleByNumber(this.children.length)('grid-template-columns')
    // applyGridStyleByNumber(this.children.length)('grid-template-rows')

    const observer = new MutationObserver(a => {
      a.forEach(v => {
        applyGridStyleByNumber(v.target.childNodes.length)('grid-template-columns')
        // applyGridStyleByNumber(v.target.childNodes.length)('grid-template-rows')
        this.cd.detectChanges()
      })
    })
    const config = { attributes: false, childList: true, subtree: false }
    observer.observe(this.elRef.nativeElement, config)
  }
}
