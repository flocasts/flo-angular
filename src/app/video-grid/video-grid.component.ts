import { maybe, IMaybe } from 'typescript-monads'
import { merge } from 'rxjs'
import { share } from 'rxjs/operators'
import {
  Component, Directive, ChangeDetectionStrategy, ContentChild,
  Input, TemplateRef, ElementRef, ViewChild, Renderer2, ViewChildren,
  QueryList, ChangeDetectorRef, AfterViewInit, Output, EventEmitter
} from '@angular/core'

export interface IFloGridItem {
  readonly id: string
}

interface IViewItem<T> {
  readonly hasSomething: boolean
  readonly selected: boolean
  readonly value?: T
}

@Directive({
  selector: '[floVideoGridItemSome]'
})
export class FloVideoGridItemSomeDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}

@Directive({
  selector: '[floVideoGridItemNone]',
})
export class FloVideoGridItemNoneDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}

@Directive({
  selector: '[floVideoGridOverlay]',
})
export class FloVideoGridOverlayDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}

const chunk = (size: number, collection: ReadonlyArray<any> = []) =>
  collection.reduce((acc, _, index) =>
    index % size === 0
      ? [...acc, collection.slice(index, index + size)]
      : acc, [])

// tslint:disable:no-object-mutation
// tslint:disable:readonly-keyword
@Component({
  selector: 'flo-video-grid',
  templateUrl: './video-grid.component.html',
  styleUrls: ['./video-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoGridComponent<TItem extends IFloGridItem> implements AfterViewInit {
  constructor(private rd: Renderer2, private cdRef: ChangeDetectorRef) { }

  private _selectedIndex = 0
  private _viewcount = 1

  @Input()
  get selectedIndex() {
    return this._selectedIndex
  }
  set selectedIndex(val: number) {
    this._selectedIndex = val
    this.selectedIndexChange.emit(this._selectedIndex)
  }

  @Input()
  get viewcount() {
    return this._viewcount
  }
  set viewcount(val: number) {
    this._viewcount = val
    this.viewcountChange.emit(this._viewcount)
  }

  setViewCount(count: number) {
    this.viewcount = count
  }

  // tslint:disable-next-line:readonly-array
  public items: IMaybe<TItem>[] = [] // TODO

  @Input() readonly trackByFunc: (item: TItem) => string

  @Output() readonly selectedIndexChange = new EventEmitter<number>()
  @Output() readonly itemsChange = new EventEmitter<ReadonlyArray<IMaybe<TItem>>>()
  @Output() readonly viewcountChange = new EventEmitter<number>()
  @Output() readonly ticked = merge(this.itemsChange, this.selectedIndexChange, this.viewcountChange).pipe(share())

  @ViewChild('floGridContainer') readonly gridContainer: ElementRef<HTMLDivElement>
  @ViewChildren('floGridItemContainer') readonly gridItemContainers: QueryList<ElementRef<HTMLDivElement>>

  @ContentChild(FloVideoGridItemSomeDirective, { read: TemplateRef }) readonly gridItemSomeTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloVideoGridItemNoneDirective, { read: TemplateRef }) readonly gridItemNoneTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloVideoGridOverlayDirective, { read: TemplateRef }) readonly gridViewOverlayTemplate: TemplateRef<HTMLElement>

  public readonly trackByFn =
    (idx: number, viewItem?: IViewItem<TItem>) =>
      maybe(viewItem)
        .flatMapAuto(i => i.value)
        .flatMapAuto(c => typeof this.trackByFunc === 'function'
          ? `${idx}_${this.trackByFunc(c)}`
          : idx)
        .valueOrUndefined()

  get viewItems() {
    return new Array<IMaybe<TItem>>(this.viewcount)
      .fill(maybe())
      .map((val, idx) => this.items[idx] ? this.items[idx] : val)
      .map((value, idx) => {
        return {
          hasSomething: value.map(() => true).valueOr(false),
          selected: this.selectedIndex === idx,
          value: value.valueOrUndefined()
        }
      })
  }

  public readonly removeItem = () => this.setItem(undefined)
  public readonly getSelectedItem = () => this.items[this.selectedIndex] ? this.items[this.selectedIndex] : maybe<TItem>()
  private readonly fillTo = (num: number) => new Array<string>(num).fill('1fr ').reduce((acc, curr) => acc + curr, '').trimRight()

  ngAfterViewInit() {
    this.updateGridStyles(this.gridItemContainers.length)
    this.gridItemContainers.changes.subscribe(a => this.updateGridStyles(a.length))
  }

  maxHeight = 900

  updateGridStyles(squareCount: number) {
    const gridCounts = this.calcNumRowsColumns(squareCount)
    const element = this.gridContainer.nativeElement
    const maxWidth = `${this.maxHeight * 3.55}px`

    // tslint:disable:no-if-statement
    if (this.gridContainer) {
      // this.rd.removeStyle(element, 'max-height')
      // this.rd.setStyle(element, 'max-width', maxWidth)
      if (gridCounts.columns <= 1) {
        this.rd.setStyle(element, 'display', 'block')
      } else {
        const children = this.gridItemContainers.map(a => a.nativeElement)

        this.rd.setStyle(element, 'display', 'grid')
        this.rd.setStyle(element, 'grid-template-columns', this.fillTo(gridCounts.gridBoxColumns))
        this.rd.setStyle(element, 'grid-template-rows', this.fillTo(gridCounts.gridBoxRows))

        if (gridCounts.shouldFill) {
          // this.rd.removeStyle(element, 'max-width')
          // this.rd.setStyle(element, 'max-height', `${this.maxHeight}px`)

          const groups = Math.ceil(children.length / gridCounts.columns) + 1

          chunk(groups, children).forEach((col, groupIdx) => {
            col.forEach((val, idx) => {
              this.rd.setStyle(val, 'grid-area', `${groupIdx * 2 + 2} / ${idx * 2 + 1} / span 2 / span 2`)
              this.rd.setStyle(val, 'align-self', 'center')
            })
          })
        } else {
          // this.rd.setStyle(element, 'max-width', maxWidth)
          children.forEach(child => {
            this.rd.removeStyle(child, 'grid-area')
            this.rd.removeStyle(child, 'align-self')
          })
        }
      }
    }
  }

  readonly calcNumRowsColumns = (n: number) => {
    const squared = Math.sqrt(n)
    const columns = Math.ceil(squared)
    const rows = columns
    const shouldFill = n === 2
    return {
      columns,
      rows,
      gridBoxColumns: shouldFill ? columns * 2 : columns,
      gridBoxRows: shouldFill ? columns * 2 : rows,
      shouldFill
    }
  }

  public setItem(item?: TItem) {
    this.items[this.selectedIndex] = maybe(item)
    this.updateCd()
  }

  private readonly updateCd = () => {
    this.cdRef.markForCheck()
    this.itemsChange.next(this.items)
  }

  setSelected(idx: number) {
    this.selectedIndex = idx
    this.updateCd()
  }

  setSelectedUsingId(id: string) {
    const idx = this.findIndexByItemId(id).valueOr(0)
    this.setSelected(idx)
  }

  findIndexByItemId = (id: string) => maybe(this.items.findIndex(a => a && a.map(b => b.id).valueOrUndefined() === id)).filter(a => a >= 0)

  swap(idx1: number, idx2: number) {
    const obj1 = this.items[idx1]
    const obj2 = this.items[idx2]

    this.items[idx1] = obj2
    this.items[idx2] = obj1

    this.updateCd()
  }

  swapWithCurrent(fromIdx: number) {
    this.swap(fromIdx, this.selectedIndex)
  }
}
