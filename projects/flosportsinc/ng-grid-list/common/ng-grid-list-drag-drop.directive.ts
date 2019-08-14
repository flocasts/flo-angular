import { IFloGridListBaseItem, FLO_GRID_LIST_GUID_GEN } from './ng-grid-list.tokens'
import { FloGridListViewComponent } from './grid/grid.component'
import { maybe } from 'typescript-monads'
import { DOCUMENT, isPlatformServer } from '@angular/common'
import { Subject } from 'rxjs'
import {
  ElementRef, Directive, HostListener, Input, Inject, Output,
  OnDestroy, AfterContentInit, Renderer2, PLATFORM_ID
} from '@angular/core'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
// tslint:disable: no-let

interface IDragDropMap<TItem> { readonly index: number, readonly value: TItem }
const CLASS_DRAGGING = 'dragging'
const CLASS_CONTAINER = '.fg.list-item-container'
const CLASS_ITEM_OVERLAY = '.list-item-overlay'

@Directive({
  selector: '[floGridListDragDrop]',
})
export class FloGridListDragDropDirective<TItem extends IFloGridListBaseItem, TElement extends HTMLElement>
  implements OnDestroy, AfterContentInit {
  constructor(public elmRef: ElementRef<TElement>, private rd: Renderer2,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private doc: any,
    @Inject(FLO_GRID_LIST_GUID_GEN) private guid: any) { }

  private _floGridListDragDrop = false
  private _document = this.doc as HTMLDocument

  @Input()
  get floGridListDragDrop() { return this._floGridListDragDrop }
  set floGridListDragDrop(val: any) {
    this._floGridListDragDrop = (val || (val as any) === '') ? true : false
    if (this._floGridListDragDrop) {
      this.rd.setAttribute(this.elmRef.nativeElement, 'draggable', 'true')
    } else {
      this.rd.removeAttribute(this.elmRef.nativeElement, 'draggable')
    }
  }

  @Input() floGridListDragDropItem: TItem
  @Input() floGridListDragDropIndex: number
  @Input() floGridListDragDropGridRef?: FloGridListViewComponent<TItem>
  @Input() floGridListDragDropHoverBgEnabled?: boolean
  @Input() floGridListDragDropHoverBgColor?: string
  @Input() floGridListDragDropHoverBgOpacity?: string | number
  @Input() floGridListDragDropDragRef?: HTMLElement

  @Output() floGridListDragDropDragoverChange = new Subject<DragEvent>()

  private supportsDragImage = () => isPlatformServer(this.platformId)
    ? false
    : 'setDragImage' in ((window as any).DataTransfer || (window as any).Clipboard).prototype
  private getTiles = () => Array.from(this._document.querySelectorAll<HTMLDivElement>(CLASS_CONTAINER))
  private removeTileDragStyling = () => this.getTiles().forEach(this.clearItemOverlayStyle)
  private preventDefaults(evt: DragEvent) {
    if (evt.preventDefault) { evt.preventDefault() }
    if (evt.stopPropagation) { evt.stopPropagation() }
  }

  dragId = `__fs_drag_${(this.guid() as string).slice(0, 8)}__`
  maybeClonedExists = () => this.floGridListDragDropDragRef && this.supportsDragImage()
    ? maybe(this._document.getElementById(this.dragId))
    : maybe<HTMLElement>()

  extractDisplayInfoFromDragEvent = (evt: DragEvent) => {
    const elm = evt.target as HTMLElement
    const clientRect = elm.getBoundingClientRect()
    return {
      offsetX: evt.clientX - clientRect.left,
      offsetY: evt.clientY - clientRect.top,
      height: `${elm.clientHeight}px`,
      width: `${elm.clientWidth}px`
    }
  }

  mutateClonedOffsetPlaceholder = (elm: HTMLDivElement) => {
    this.rd.setStyle(elm, 'position', 'absolute')
    this.rd.setStyle(elm, 'top', '-9999px')
    this.rd.setStyle(elm, 'left', '-9999px')
    this.rd.setAttribute(elm, 'id', this.dragId)
    return elm
  }

  @HostListener('dragstart', ['$event']) dragstart(evt: DragEvent) {
    maybe(evt.dataTransfer)
      .tapSome(dt => {
        dt.setData('text', JSON.stringify({ index: this.floGridListDragDropIndex, value: this.floGridListDragDropItem }))
        this.maybeClonedExists()
          .tapSome(cloned => {
            const info = this.extractDisplayInfoFromDragEvent(evt)
            const zIndexPlus = Date.now().toString()
            this.rd.setStyle(cloned, 'height', info.height)
            this.rd.setStyle(cloned, 'width', info.width)
            this.rd.setStyle(cloned, 'z-index', zIndexPlus.substr(zIndexPlus.length - 7))
            dt.setDragImage(cloned, info.offsetX, info.offsetY)
          })
      })
  }

  private resetStyles = (elm: HTMLElement) => {
    this.rd.setStyle(elm, 'backgroundColor', 'inherit')
    this.rd.setStyle(elm, 'opacity', 'inherit')
  }

  private maybeItemOverlay = (elm: HTMLElement) => maybe(elm.querySelector<HTMLDivElement>(CLASS_ITEM_OVERLAY))
  private clearItemOverlayStyle = (elm: HTMLElement) => this.maybeItemOverlay(elm).tapSome(this.resetStyles)
  private setItemOverlayStyle = (elm: HTMLElement) => maybe(this.floGridListDragDropHoverBgColor)
    .flatMap(color => this.maybeItemOverlay(elm).map(element => ({ element, color })))
    .filter(res => res.element.style.backgroundColor !== res.color)
    .tapSome(res => {
      if (this.floGridListDragDropHoverBgOpacity) {
        this.rd.setStyle(res.element, 'opacity', this.floGridListDragDropHoverBgOpacity.toString())
      }
      this.rd.setStyle(res.element, 'backgroundColor', res.color)
      this.rd.addClass(res.element, CLASS_DRAGGING)
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

  @HostListener('drop', ['$event']) drop(evt: DragEvent) {
    this.preventDefaults(evt)

    // clear styles
    if (this.floGridListDragDropHoverBgEnabled) {
      this.removeTileDragStyling()

      // ingore subtle fade-out styles
      setTimeout(() => {
        this.getTiles().forEach(a => {
          this.maybeItemOverlay(a).tapSome(b => this.rd.removeClass(b, CLASS_DRAGGING))
        })
      }, 200) // TODO: sync with fade time 200ms
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

  ngAfterContentInit() {
    if (isPlatformServer(this.platformId)) { return }
    this.maybeClonedExists()
      .tapNone(() => {
        if (this.floGridListDragDropDragRef && this.supportsDragImage()) {
          const elm = this.mutateClonedOffsetPlaceholder(this.floGridListDragDropDragRef.cloneNode(true) as HTMLDivElement)
          this.rd.appendChild(this._document.body, elm)
        }
      })
  }

  ngOnDestroy() {
    this.maybeClonedExists()
      .filter(a => a.parentNode !== null)
      .tapSome(a => (a.parentNode as Node).removeChild(a))
  }
}
