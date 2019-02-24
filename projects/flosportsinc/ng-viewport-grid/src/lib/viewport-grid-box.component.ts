import { maybe } from 'typescript-monads'
import { Subject, Observable } from 'rxjs'
import { shortGuid } from './util'
import { ViewportGridBoxItemDirective } from './viewport-grid-box-item.directive'
import { debounceTime, filter, map } from 'rxjs/operators'
import {
  Component, ChangeDetectionStrategy, ElementRef, ViewChild, Renderer2,
  Output, HostListener, QueryList, ContentChildren, ContentChild, HostBinding, Input
} from '@angular/core'

const BORDER_CLASS = 'flo-vp-border'
const SELECTION_CLASS = 'flo-vp-selected'
const DEFAULT_BOX = 'inset 0px 0px 0px 3px white;'
const computeFadeStyle = (style: number) => `box-shadow ${style.toString()}ms`

export const GRID_BOX_SELECTOR_NAME = 'flo-viewport-grid-box'

export type ViewportGridBoxComponentSelectedEvent<TElement = HTMLElement> = ViewportGridBoxComponent<TElement>
interface ViewportGridBoxComponentSelectedEventWrapper<TElement = HTMLElement> {
  readonly isSelected: boolean
  readonly gridbox: ViewportGridBoxComponent<TElement>
}

const stopRace = <T>(source: Observable<T>) => source.pipe(debounceTime(1))

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
      width: 100%;
    }
    div.${SELECTION_CLASS} {
      box-shadow: ${DEFAULT_BOX}
      pointer-events: none;
    }
  `],
  template: `
    <div #selectionContainer class="flo-vp-border"></div>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportGridBoxComponent<TElement = HTMLElement> {
  constructor(private _renderer: Renderer2, public elementRef: ElementRef<TElement>) { }

  private readonly isSelectedSource = new Subject<ViewportGridBoxComponentSelectedEventWrapper<TElement>>()

  @Input() public readonly floViewportGridBoxShowSelectionBox = true
  @Input() public readonly floViewportGridBoxShowSelectionBoxFadeTimeMs = 400

  @Output() public readonly isSelected$ = this.isSelectedSource.pipe(stopRace, filter(a => a.isSelected === true), map(a => a.gridbox))
  @Output() public readonly isNotSelected$ = this.isSelectedSource.pipe(stopRace, filter(a => a.isSelected === false), map(a => a.gridbox))
  @Output() public readonly clicked$ = new Subject<ViewportGridBoxComponent<TElement>>()

  @ContentChild(ViewportGridBoxItemDirective) private readonly _panelItem?: ViewportGridBoxItemDirective<TElement>
  @ContentChildren(ViewportGridBoxItemDirective) private readonly _panelItems?: QueryList<ViewportGridBoxItemDirective<TElement>>
  @ViewChild('selectionContainer') private readonly _selectionContainer?: ElementRef<HTMLDivElement>

  @HostBinding('attr.id') public readonly guid = shortGuid()
  @HostListener('click') public readonly _onClick = () => this.clicked$.next(this)

  private readonly _maybeSlectionContainer = () => maybe(this._selectionContainer).map(a => a.nativeElement)

  public readonly maybePanelItemElement = () => maybe(this._panelItem).map(a => a.elementRef.nativeElement)
  public readonly maybePanelItem = () => maybe(this._panelItem)
  public readonly maybePanelItems = () => maybe(this._panelItems).map(a => a.toArray())
  public readonly maybePanelItemElements = () =>
    this.maybePanelItems().map(a => a.map(ref => ref.elementRef.nativeElement) as ReadonlyArray<TElement>)

  private readonly _addBorderClass =
    (elm: HTMLElement) =>
      (cls: string) => {
        this._renderer.setStyle(elm, 'transition', computeFadeStyle(this.floViewportGridBoxShowSelectionBoxFadeTimeMs))
        this._renderer.addClass(elm, cls)
      }

  private readonly _removeBorderClass =
    (elm: HTMLElement) =>
      (cls: string) => {
        this._renderer.removeStyle(elm, 'transition')
        this._renderer.removeClass(elm, cls)
      }

  public readonly setSelected =
    (isSelected: boolean) =>
      this._maybeSlectionContainer()
        .tapSome(el => {
          this.maybePanelItems()
            .tapSome(show => {
              const canShowGranular = !show.some(b => !b.floViewportGridBoxItemShowSelectionBox)
              this.floViewportGridBoxShowSelectionBox && canShowGranular && isSelected
                ? this._addBorderClass(el)(SELECTION_CLASS)
                : this._removeBorderClass(el)(SELECTION_CLASS)
              this.isSelectedSource.next({ isSelected, gridbox: this })
            })
        })

  public readonly toggleSelected = () =>
    this.isSelected()
      ? this.setSelected(false)
      : this.setSelected(true)

  public readonly isSelected = () =>
    this._maybeSlectionContainer()
      .map(el => el.classList.contains(SELECTION_CLASS))
      .valueOr(false)
}
