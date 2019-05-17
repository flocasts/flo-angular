import { ElementRef, Directive, HostListener, Input } from '@angular/core'
import { IFloGridListBaseItem } from './ng-grid-list.tokens'
import { FloGridTilesComponent } from './grid/grid.component'
import { maybe } from 'typescript-monads'

interface IDragDropMap<TItem> { readonly index: number, readonly value: TItem }

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
@Directive({
  selector: '[floGridListDragDrop]',
})
export class FloGridListDragDropDirective<TItem extends IFloGridListBaseItem, TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }

  private _floGridListDragDrop = false

  @Input()
  get floGridListDragDrop() { return this._floGridListDragDrop }
  set floGridListDragDrop(val: any) {
    this._floGridListDragDrop = (val || (val as any) === '') ? true : false
    this.elmRef.nativeElement.draggable = this._floGridListDragDrop
  }

  @Input() floGridListDragDropItem: TItem
  @Input() floGridListDragDropIndex: number
  @Input() floGridListDragDropGridRef?: FloGridTilesComponent<TItem>

  @HostListener('dragover', ['$event']) dragover(evt: DragEvent) {
    evt.preventDefault()
  }
  @HostListener('dragstart', ['$event']) dragstart(evt: DragEvent) {
    maybe(evt.dataTransfer)
      .tapSome(dt => dt.setData('text', JSON.stringify({ index: this.floGridListDragDropIndex, value: this.floGridListDragDropItem })))
  }
  @HostListener('drop', ['$event']) drop(evt: DragEvent) {
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
