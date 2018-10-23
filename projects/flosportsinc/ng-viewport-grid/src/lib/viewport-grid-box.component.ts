import { maybe } from 'typescript-monads'
import { Subject } from 'rxjs'
import { shortGuid } from './util'
import { ViewportGridBoxItemDirective } from './viewport-grid-box-item.directive'
import {
  Component, ChangeDetectionStrategy, ElementRef, ViewChild, Renderer2,
  Output, HostListener, QueryList, ContentChildren, ContentChild, HostBinding
} from '@angular/core'

const BORDER_CLASS = 'border'
const SELECTION_CLASS = 'selected'
const DROP_STYLE_CLASS = 'drop'

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
    .${BORDER_CLASS} {
      z-index: 1;
      transition: box-shadow 500ms;
      width: 100%;
      pointer-events: none;
    }
    div.${BORDER_CLASS}.${DROP_STYLE_CLASS} {
      box-shadow: inset 0px 0px 0px 3px yellow;
    }
    div.${BORDER_CLASS}.${SELECTION_CLASS} {
      box-shadow: inset 0px 0px 0px 3px white;
    }
  `],
  template: `
    <div #selectionContainer></div>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportGridBoxComponent<TElement = HTMLElement> {
  constructor(private _renderer: Renderer2, public elementRef: ElementRef<TElement>) { }

  @Output() public readonly isSelected$ = new Subject<boolean>()
  @Output() public readonly clicked$ = new Subject<ViewportGridBoxComponent<TElement>>()
  @ContentChild(ViewportGridBoxItemDirective, { read: ElementRef }) private readonly _panelItem?: ElementRef<TElement>
  @ContentChildren(ViewportGridBoxItemDirective, { read: ElementRef }) private readonly _panelItems?: QueryList<ElementRef<TElement>>
  @ViewChild('selectionContainer') private readonly _selectionContainer?: ElementRef<HTMLDivElement>
  @HostBinding('draggable') public readonly draggable = true
  @HostBinding('attr.id') public readonly guid = shortGuid()
  @HostListener('click', ['$event.target']) public readonly _onClick = _ => this.clicked$.next(this)

  private readonly _maybeSlectionContainer = () => maybe(this._selectionContainer).map(a => a.nativeElement)
  public readonly maybePanelItemElement = () => maybe(this._panelItem).map(a => a.nativeElement)
  public readonly maybePanelItemElements = () =>
    maybe(this._panelItems).map(a => a.toArray().map(ref => ref.nativeElement) as ReadonlyArray<TElement>)

  readonly addBorderClass =
    (elm: HTMLElement) =>
      (cls: string) => {
        this._renderer.addClass(elm, BORDER_CLASS)
        this._renderer.addClass(elm, cls)
      }

  readonly removeBorderClass =
    (elm: HTMLElement) =>
      (cls: string) => {
        this._renderer.removeClass(elm, BORDER_CLASS)
        this._renderer.removeClass(elm, cls)
      }

  public readonly setSelected =
    (isSelected: boolean) =>
      this._maybeSlectionContainer()
        .tapSome(el => {
          isSelected
            ? this.addBorderClass(el)(SELECTION_CLASS)
            : this.removeBorderClass(el)(SELECTION_CLASS)
          this.isSelected$.next(isSelected)
        })

  public readonly setDropStyles = () =>
    this._maybeSlectionContainer()
      .tapSome(el => {
        this.isSelected()
          ? this.removeBorderClass(el)(DROP_STYLE_CLASS)
          : this.addBorderClass(el)(DROP_STYLE_CLASS)
      })

  public readonly toggleSelected = () =>
    this.isSelected()
      ? this.setSelected(false)
      : this.setSelected(true)

  public readonly isSelected = () =>
    this._maybeSlectionContainer().match({
      none: () => false,
      some: el => el.classList.contains(SELECTION_CLASS)
    })
}
