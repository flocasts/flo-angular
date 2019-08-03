import { ElementRef, Directive, HostListener, Input, Inject } from '@angular/core'
import { IFloGridListBaseItem } from './ng-grid-list.tokens'
import { FloGridListViewComponent } from './grid/grid.component'
import { maybe, IMaybe } from 'typescript-monads'
import { DOCUMENT } from '@angular/common'

interface IDragDropMap<TItem> { readonly index: number, readonly value: TItem }

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
// tslint:disable: no-if-statement
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

  private _floGridListDragDropDragImage = maybe<HTMLImageElement>()

  private createImg = (src: string) => {
    const img = new Image()
    img.src = src
    return img
  }

  private findImageInDom = (src: string) => maybe((this.doc as HTMLDocument).querySelector(`img[src="${src}"]`) as HTMLImageElement | null)

  @Input()
  get floGridListDragDropDragImage() {
    return this._floGridListDragDropDragImage
  }
  set floGridListDragDropDragImage(val: IMaybe<HTMLImageElement>) {
    this._floGridListDragDropDragImage = val instanceof HTMLImageElement
      ? maybe<HTMLImageElement>(val)
      : typeof (val) === 'string'
        ? this.findImageInDom(val as string)
          .match({
            some: maybe,
            none: () => maybe<HTMLImageElement>(this.createImg(val))
          })
        : maybe<HTMLImageElement>()
  }

  @Input() floGridListDragDropItem: TItem
  @Input() floGridListDragDropIndex: number
  @Input() floGridListDragDropGridRef?: FloGridListViewComponent<TItem>

  @HostListener('dragover', ['$event']) dragover(evt: DragEvent) {
    evt.preventDefault()
  }

  private dragImageElmRef?: HTMLElement

  @HostListener('dragstart', ['$event']) dragstart(evt: DragEvent) {
    maybe(evt.dataTransfer)
      .tapSome(dt => {
        dt.setData('text', JSON.stringify({ index: this.floGridListDragDropIndex, value: this.floGridListDragDropItem }))
        this.floGridListDragDropDragImage.tapSome(img => {
          const height = (evt.target as HTMLElement).clientHeight
          const width = (evt.target as HTMLElement).clientWidth
          const imgContainer = document.createElement('div')
          img.style.width = '100%'
          img.style.height = '100%'
          imgContainer.style.position = 'absolute'
          imgContainer.style.height = `${height}px`
          imgContainer.style.width = `${width}px`
          imgContainer.style.top = '0'
          imgContainer.style.left = '-10000px'
          imgContainer.appendChild(img)
          document.body.appendChild(imgContainer)
          this.dragImageElmRef = imgContainer
          dt.setDragImage(imgContainer, evt.layerX, evt.layerY)
        })
      })
  }

  @HostListener('dragend', ['$event']) dragend(evt: DragEvent) {
    evt.preventDefault()
    if (this.dragImageElmRef) { this.dragImageElmRef.remove() }
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
