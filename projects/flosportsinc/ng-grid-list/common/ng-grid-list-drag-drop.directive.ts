import { ElementRef, Directive, HostListener, Input, Inject, Output } from '@angular/core'
import { IFloGridListBaseItem } from './ng-grid-list.tokens'
import { FloGridListViewComponent } from './grid/grid.component'
import { maybe, IMaybe } from 'typescript-monads'
import { DOCUMENT } from '@angular/common'
import { Subject } from 'rxjs'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
// tslint:disable: no-if-statement
// tslint:disable: no-let

interface IDragDropMap<TItem> { readonly index: number, readonly value: TItem }
const CLASS_DRAGGING = 'dragging'
const CLASS_CONTAINER = '.fg.list-item-container'
const CLASS_ITEM_OVERLAY = '.list-item-overlay'

@Directive({
  selector: '[floGridListDragDrop]',
})
export class FloGridListDragDropDirective<TItem extends IFloGridListBaseItem, TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>, @Inject(DOCUMENT) private doc: any) { }

  private _floGridListDragDrop = false
  private _floGridListDragDropDragImage = maybe<HTMLImageElement>()

  @Input()
  get floGridListDragDrop() { return this._floGridListDragDrop }
  set floGridListDragDrop(val: any) {
    this._floGridListDragDrop = (val || (val as any) === '') ? true : false
    this.elmRef.nativeElement.draggable = this._floGridListDragDrop
  }

  @Input() floGridListDragDropItem: TItem
  @Input() floGridListDragDropIndex: number
  @Input() floGridListDragDropGridRef?: FloGridListViewComponent<TItem>
  @Input() floGridListDragDropHoverBgEnabled?: boolean
  @Input() floGridListDragDropHoverBgColor?: string
  @Input() floGridListDragDropHoverBgOpacity?: string | number

  private createImg = (src: string) => {
    const img = new Image()
    img.src = src
    return img
  }

  @Input() floGridListDragDropDragRef: any

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

  @Output() floGridListDragDropDragoverChange = new Subject<DragEvent>()

  private _document = this.doc as HTMLDocument
  private findImageInDom = (src: string) => maybe(this._document.querySelector(`img[src="${src}"]`) as HTMLImageElement | null)
  private getTiles = () => this._document.querySelectorAll<HTMLDivElement>(CLASS_CONTAINER)
  private removeTileDragStyling = () => this.getTiles().forEach(this.clearItemOverlayStyle)
  private preventDefaults(evt: DragEvent) {
    if (evt.preventDefault) { evt.preventDefault() }
    if (evt.stopPropagation) { evt.stopPropagation() }
  }

  @HostListener('dragstart', ['$event']) dragstart(evt: DragEvent) {
    maybe(evt.dataTransfer)
      .tapSome(dt => {
        dt.setData('text', JSON.stringify({ index: this.floGridListDragDropIndex, value: this.floGridListDragDropItem }))
        const height = (evt.target as HTMLElement).clientHeight
        const width = (evt.target as HTMLElement).clientWidth
        this.floGridListDragDropDragRef.style.height = `${height}px`
        this.floGridListDragDropDragRef.style.width = `${width}px`

        dt.setDragImage(this.floGridListDragDropDragRef, evt.layerX, evt.layerY)
        // this.floGridListDragDropDragImage.tapSome(img => {
        //   const height = (evt.target as HTMLElement).clientHeight
        //   const width = (evt.target as HTMLElement).clientWidth
        //   // const imgContainer = document.createElement('div')
        //   img.style.width = '100%'
        //   img.style.height = '100%'
        //   // imgContainer.style.position = 'absolute'
        //   // imgContainer.style.height = `${height}px`
        //   // imgContainer.style.width = `${width}px`
        //   // imgContainer.style.top = '0'
        //   // imgContainer.style.left = '-10000px'
        //   // imgContainer.appendChild(img)
        //   // document.body.appendChild(imgContainer)
        //   // this.dragImageElmRef = imgContainer
        //   dt.setDragImage(imgContainer, evt.layerX, evt.layerY)
        // })
      })
  }

  private resetStyles = (elm: HTMLElement) => {
    elm.style.backgroundColor = 'inherit'
    elm.style.opacity = 'inherit'
  }

  private maybeItemOverlay = (elm: HTMLElement) => maybe(elm.querySelector<HTMLDivElement>(CLASS_ITEM_OVERLAY))
  private clearItemOverlayStyle = (elm: HTMLElement) => this.maybeItemOverlay(elm).tapSome(this.resetStyles)
  private setItemOverlayStyle = (elm: HTMLElement) => maybe(this.floGridListDragDropHoverBgColor)
    .flatMap(color => this.maybeItemOverlay(elm).map(element => ({ element, color })))
    .filter(res => res.element.style.backgroundColor !== res.color)
    .tapSome(res => {
      if (this.floGridListDragDropHoverBgOpacity) { res.element.style.opacity = this.floGridListDragDropHoverBgOpacity.toString() }
      res.element.style.backgroundColor = res.color
      res.element.classList.add(CLASS_DRAGGING)
    })

  @HostListener('dragover', ['$event']) dragover(evt: DragEvent) {
    this.preventDefaults(evt)
    this.floGridListDragDropDragoverChange.next(evt)

    if (!this.floGridListDragDropHoverBgEnabled) { return }

    this.getTiles().forEach(elm => {
      if (elm.contains(evt.target as HTMLDivElement)) {
        this.setItemOverlayStyle(elm)
      } else {
        this.clearItemOverlayStyle(elm)
      }
    })
  }

  private dragImageElmRef?: HTMLElement

  @HostListener('dragend', ['$event']) dragend(evt: DragEvent) {
    this.preventDefaults(evt)
    if (this.dragImageElmRef) { this.dragImageElmRef.remove() }
  }

  @HostListener('drop', ['$event']) drop(evt: DragEvent) {
    this.preventDefaults(evt)

    // clear styles
    if (this.floGridListDragDropHoverBgEnabled) {
      this.removeTileDragStyling()

      // ingore subtle fade-out styles
      setTimeout(() => {
        this.getTiles().forEach(a => {
          this.maybeItemOverlay(a).tapSome(b => b.classList.remove(CLASS_DRAGGING))
        })
      }, 200) // FADE TIME: 200ms
    }

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
