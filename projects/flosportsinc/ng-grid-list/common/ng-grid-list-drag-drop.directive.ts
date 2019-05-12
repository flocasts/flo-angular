import { ElementRef, Directive, HostListener, Input } from '@angular/core'
import { IFloGridListBaseItem } from './ng-grid-list.tokens'
import { FloGridTilesComponent } from './grid/grid-tiles.component'
import { maybe } from 'typescript-monads'

interface IDragDropMap<TItem> { readonly index: number, readonly value: TItem }

@Directive({
  selector: '[floGridListDragDrop]',
})
export class FloGridListDragDropDirective<TItem extends IFloGridListBaseItem, TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) {
    elmRef.nativeElement.draggable = this.floGridListDragDrop
  }

  @Input() readonly floGridListDragDrop = true
  @Input() readonly floGridListDragDropItem: TItem
  @Input() readonly floGridListDragDropIndex: number
  @Input() readonly floGridListDragDropGridRef?: FloGridTilesComponent<TItem>

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
        res.gridRef.setValueAtIndex(res.replace.to.index, res.replace.from.value)
        res.gridRef.setValueAtIndex(res.replace.from.index, res.replace.to.value)
      })
  }
}
