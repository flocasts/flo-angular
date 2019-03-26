import {
  Component, Directive, ChangeDetectionStrategy, ContentChild,
  Input, TemplateRef, ElementRef, ViewChild, Renderer2, ViewChildren,
  QueryList, ChangeDetectorRef, AfterViewInit, Output, EventEmitter
} from '@angular/core'
import { maybe, IMaybe } from 'typescript-monads'
import { merge } from 'rxjs'
import { share } from 'rxjs/operators'

export interface IFloGridItem {
  readonly id: string
}

@Directive({
  selector: '[floVideoGridItemSome]'
})
export class FloVideoGridItemSomeDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}

@Directive({
  selector: '[floVideoGridItemNone]'
})
export class FloVideoGridItemNoneDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}

const chunk = (size: number, collection: ReadonlyArray<any> = []) =>
  collection.reduce((acc, _, index) =>
    index % size === 0
      ? [...acc, collection.slice(index, index + size)]
      : acc, [])

@Component({
  selector: 'flo-video-grid',
  templateUrl: './video-grid.component.html',
  styleUrls: ['./video-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoGridComponent<TItem extends IFloGridItem> implements AfterViewInit {
  constructor(private rd: Renderer2, private cdRef: ChangeDetectorRef) { }

  // tslint:disable-next-line:readonly-keyword
  private selectedIndexValue = 0

  @Input()
  get selectedIndex() {
    return this.selectedIndexValue
  }
  set selectedIndex(val: number) { // TODO: check is number
    // tslint:disable-next-line: no-object-mutation
    this.selectedIndexValue = val
    this.selectedIndexChange.emit(this.selectedIndexValue)
  }

  // tslint:disable: readonly-keyword
  // tslint:disable-next-line:readonly-array
  public items: IMaybe<TItem>[] = [] // TODO

  @Input() readonly viewPortCount = 4 // TODO

  @Output() readonly selectedIndexChange = new EventEmitter<number>()
  @Output() readonly itemsChange = new EventEmitter<ReadonlyArray<IMaybe<TItem>>>()
  @Output() readonly ticked = merge(this.itemsChange, this.selectedIndexChange).pipe(share())

  @ViewChild('floGridContainer') readonly gridContainer: ElementRef<HTMLDivElement>
  @ViewChildren('floGridItemContainer') readonly gridItemContainers: QueryList<ElementRef<HTMLDivElement>>

  @ContentChild(FloVideoGridItemSomeDirective, { read: TemplateRef }) readonly gridItemSomeTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloVideoGridItemNoneDirective, { read: TemplateRef }) readonly gridItemNoneTemplate: TemplateRef<HTMLElement>

  public readonly trackByFn =
    (idx: number, item?: TItem) =>
      maybe(item)
        // .flatMapAuto(a => a.value)
        .flatMapAuto(c => `${idx}_${c.id}`)
        .valueOrUndefined()

  get viewItems() {
    return new Array<IMaybe<TItem>>(this.viewPortCount).fill(maybe())
      .map((val, idx) => {
        return this.items[idx]
          ? this.items[idx]
          : val
      })
      .map((value, idx) => {
        return {
          hasSomething: value.map(() => true).valueOr(false),
          selected: this.selectedIndex === idx,
          value: value.valueOrUndefined()
        }
      })
  }

  public setItem(item?: TItem) {
    // tslint:disable-next-line: no-object-mutation
    this.items[this.selectedIndex] = maybe(item)
    this.itemsChange.next(this.items)
    this.cdRef.markForCheck()
  }

  public readonly removeItem = () => this.setItem(undefined)
  public readonly getSelectedItem = () => this.items[this.selectedIndex] ? this.items[this.selectedIndex] : maybe<TItem>()
  private readonly fillTo = (num: number) => new Array<string>(num).fill('1fr ').reduce((acc, curr) => acc + curr, '').trimRight()

  ngAfterViewInit() {
    this.updateGridStyles(this.gridItemContainers.length)
    this.gridItemContainers.changes.subscribe(a => this.updateGridStyles(a.length))
  }

  updateGridStyles(squareCount: number) {
    const gridCounts = this.calcNumRowsColumns(squareCount)
    const element = this.gridContainer.nativeElement

    // tslint:disable:no-if-statement
    if (this.gridContainer) {
      this.rd.removeStyle(element, 'max-height')
      this.rd.setStyle(element, 'max-width', '1200px')
      if (gridCounts.columns <= 1) {
        this.rd.setStyle(element, 'display', 'block')
      } else {
        const children = this.gridItemContainers.map(a => a.nativeElement)

        this.rd.setStyle(element, 'display', 'grid')
        this.rd.setStyle(element, 'grid-template-columns', this.fillTo(gridCounts.gridBoxColumns))
        this.rd.setStyle(element, 'grid-template-rows', this.fillTo(gridCounts.gridBoxRows))

        if (gridCounts.shouldFill) {
          this.rd.removeStyle(element, 'max-width')
          this.rd.setStyle(element, 'max-height', '675px')

          const groups = Math.ceil(children.length / gridCounts.columns) + 1

          chunk(groups, children).forEach((col, groupIdx) => {
            col.forEach((val, idx) => {
              this.rd.setStyle(val, 'grid-area', `${groupIdx * 2 + 2} / ${idx * 2 + 1} / span 2 / span 2`)
              this.rd.setStyle(val, 'align-self', 'center')
            })
          })
        } else {
          this.rd.setStyle(element, 'max-width', '1200px')
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

  setSelected(idx: number) {
    // tslint:disable-next-line: no-object-mutation
    this.selectedIndex = idx
  }
}
