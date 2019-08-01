import { ElementRef, Directive, HostListener, Input } from '@angular/core'
import { IFloGridListBaseItem } from './ng-grid-list.tokens'
import { FloGridListViewComponent } from './grid/grid.component'
import { maybe, IMaybe } from 'typescript-monads'

interface IDragDropMap<TItem> { readonly index: number, readonly value: TItem }

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
// tslint:disable: no-if-statement
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

  private _floGridListDragDropDragImage = maybe<HTMLImageElement>()

  private createImg = (src: string) => {
    const img = new Image()
    img.src = src
    return img
  }

  @Input()
  get floGridListDragDropDragImage() {
    return this._floGridListDragDropDragImage
  }
  set floGridListDragDropDragImage(val: IMaybe<HTMLImageElement>) {
    this._floGridListDragDropDragImage = val instanceof HTMLImageElement
      ? maybe<HTMLImageElement>(val)
      : typeof(val) === 'string'
        ? maybe<HTMLImageElement>(this.createImg(val)) // TODO: this is last check, lookup dom references and clone node before this method
        : maybe<HTMLImageElement>()
  }

  @Input() floGridListDragDropItem: TItem
  @Input() floGridListDragDropIndex: number
  @Input() floGridListDragDropGridRef?: FloGridListViewComponent<TItem>

  @HostListener('dragover', ['$event']) dragover(evt: DragEvent) {
    evt.preventDefault()
  }

  @HostListener('dragstart', ['$event']) dragstart(evt: DragEvent) {
    maybe(evt.dataTransfer)
      .tapSome(dt => {
        dt.setData('text', JSON.stringify({ index: this.floGridListDragDropIndex, value: this.floGridListDragDropItem }))
        this.floGridListDragDropDragImage.tapSome(img => dt.setDragImage(img, 0, 0))
      })
  }

  @HostListener('drop', ['$event']) drop(evt: DragEvent) {
    if (evt.preventDefault) { evt.preventDefault() }
    if (evt.stopPropagation) { evt.stopPropagation() }

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
