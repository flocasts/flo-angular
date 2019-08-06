import { ElementRef, Directive, HostListener, Input, Inject, Output } from '@angular/core'
import { IFloGridListBaseItem } from './ng-grid-list.tokens'
import { FloGridListViewComponent } from './grid/grid.component'
import { maybe } from 'typescript-monads'
import { DOCUMENT } from '@angular/common'
import { Subject } from 'rxjs'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
// tslint:disable: no-if-statement
// tslint:disable: no-let

interface IDragDropMap<TItem> { readonly index: number, readonly value: TItem }
const DRAG_CLASS = 'dragging'

@Directive({
  selector: '[floGridListDragDrop]',
})
export class FloGridListDragDropDirective<TItem extends IFloGridListBaseItem, TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>, @Inject(DOCUMENT) private doc: any) { }

  private _floGridListDragDrop = false

  @Input()
  get floGridListDragDrop() { return this._floGridListDragDrop }
  set floGridListDragDrop(val: any) {
    this._floGridListDragDrop = (val || (val as any) === '') ? true : false
    this.elmRef.nativeElement.draggable = this._floGridListDragDrop
  }

  @Input() floGridListDragDropItem: TItem
  @Input() floGridListDragDropIndex: number
  @Input() floGridListDragDropGridRef?: FloGridListViewComponent<TItem>

  @Output() floGridListDragDropDragoverChange = new Subject<DragEvent>()

  private _document = this.doc as HTMLDocument
  private getTiles = () => this._document.querySelectorAll<HTMLDivElement>('.fg.list-item-container')
  private removeTileDragStyling = () => this.getTiles().forEach(t => t.classList.remove(DRAG_CLASS))
  private preventDefaults(evt: DragEvent) {
    if (evt.preventDefault) { evt.preventDefault() }
    if (evt.stopPropagation) { evt.stopPropagation() }
  }

  @HostListener('dragstart', ['$event']) dragstart(evt: DragEvent) {
    maybe(evt.dataTransfer)
      .tapSome(dt => dt.setData('text', JSON.stringify({ index: this.floGridListDragDropIndex, value: this.floGridListDragDropItem })))
  }

  @HostListener('dragover', ['$event']) dragover(evt: DragEvent) {
    this.preventDefaults(evt)
    this.floGridListDragDropDragoverChange.next(evt)
    this.getTiles().forEach(elm => {
      if (!elm.contains(evt.target as HTMLDivElement)) {
        if (elm.classList.contains(DRAG_CLASS)) {
          elm.classList.remove(DRAG_CLASS)
        }
      } else {
        elm.classList.add(DRAG_CLASS)
        // const d = elm.querySelector<HTMLDivElement>('.selection-border')
        // if (d) {
        //   d.style.transition = 'unset'
        // }
      }
    })
  }

  @HostListener('drop', ['$event']) drop(evt: DragEvent) {
    this.preventDefaults(evt)
    this.removeTileDragStyling()

    maybe(evt.dataTransfer)
      .map(dt => JSON.parse(dt.getData('text')) as IDragDropMap<TItem>)
      .map(from => ({ from, to: { index: this.floGridListDragDropIndex, value: this.floGridListDragDropItem } }))
      .filter(replace => replace.from.index !== replace.to.index)
      .flatMap(replace => maybe(this.floGridListDragDropGridRef)
        .map(gridRef => ({ gridRef, replace })))
      .tapSome(res => {
        maybe(res.replace.from.value)
          .filter(fromVal => res.gridRef.isItemInGrid(fromVal))
          .tap({
            none: () => res.gridRef.swapItemsAtIndex(res.replace.to.index, res.replace.from.value, res.replace.from.index),
            some: _ => res.gridRef.swapItems(res.replace.from.value, res.replace.to.index)
          })
      })
  }
}
