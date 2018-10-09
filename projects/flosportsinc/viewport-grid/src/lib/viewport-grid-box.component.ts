import {
  Component, ChangeDetectionStrategy, ElementRef, ViewChild, Renderer2,
  Output, HostListener, QueryList, ContentChildren, ContentChild, HostBinding
} from '@angular/core'
import { maybe } from 'typescript-monads'
import { Subject } from 'rxjs'
import { ViewportGridBoxItemDirective } from './viewport-grid-box-item.directive'

const SELECTION_CLASS = 'selected'
export const GRID_BOX_SELECTOR_NAME = 'flo-viewport-grid-box'

@Component({
  selector: GRID_BOX_SELECTOR_NAME,
  styles: [`
    :host {
      overflow: hidden;
      height: 0;
      padding-top: 56.25%;
      position: relative;
    }
    div.${SELECTION_CLASS} {
      box-shadow: inset 0px 0px 0px 4px white;
      z-index: 1;
      width: 100%;
      pointer-events: none;
      transition: box-shadow 500ms;
    }
  `],
  template: `
    <div #selectionContainer></div>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportGridBoxComponent<TElement = HTMLElement> {
  constructor(private _renderer: Renderer2, public elementRef: ElementRef<ViewportGridBoxComponent<TElement>>) { }

  @Output() public readonly isSelected$ = new Subject<boolean>()
  @Output() public readonly clicked$ = new Subject<ViewportGridBoxComponent<TElement>>()
  @ContentChild(ViewportGridBoxItemDirective, { read: ElementRef }) private readonly _panelItem?: ElementRef<TElement>
  @ContentChildren(ViewportGridBoxItemDirective, { read: ElementRef }) private readonly _panelItems?: QueryList<ElementRef<TElement>>
  @ViewChild('selectionContainer') private readonly _selectionContainer?: ElementRef<HTMLDivElement>
  @HostListener('click', ['$event.target']) public readonly _onClick = _ => this.clicked$.next(this)

  private readonly _maybeSlectionContainer = () => maybe(this._selectionContainer).map(a => a.nativeElement)
  public readonly maybePanelItemElement = () => maybe(this._panelItem).map(a => a.nativeElement)
  public readonly maybePanelItemElements = () =>
    maybe(this._panelItems).map(a => a.toArray().map(ref => ref.nativeElement) as ReadonlyArray<TElement>)

  public readonly setSelected =
    (isSelected: boolean) =>
      this._maybeSlectionContainer()
        .tapSome(el => {
          isSelected
            ? this._renderer.addClass(el, SELECTION_CLASS)
            : this._renderer.removeClass(el, SELECTION_CLASS)
          this.isSelected$.next(isSelected)
        })

  public readonly toggleSelected =
    () =>
      this.isSelected()
        ? this.setSelected(false)
        : this.setSelected(true)

  public readonly isSelected =
    () =>
      this._maybeSlectionContainer().match({
        none: () => undefined,
        some: el => el.classList.contains(SELECTION_CLASS)
      })
}
