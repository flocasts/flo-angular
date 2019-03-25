import {
  Component, Directive, ChangeDetectionStrategy, ContentChild,
  Input, TemplateRef, ElementRef, SimpleChanges, OnChanges, ViewChild,
  Renderer2, ViewChildren, QueryList, ChangeDetectorRef, AfterViewInit, Output, EventEmitter
} from '@angular/core'
import { IMaybe, maybe } from 'typescript-monads'
import { FloVideoGridListComponent } from '../video-grid-list/video-grid-list.component'

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
  collection.reduce(
    (acc, _, index) =>
      index % size === 0
        ? [...acc, collection.slice(index, index + size)]
        : acc,
    [])

@Component({
  selector: 'flo-video-grid',
  templateUrl: './video-grid.component.html',
  styleUrls: ['./video-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoGridComponent<TItem extends IFloGridItem> implements AfterViewInit {
  constructor(private elmRef: ElementRef<HTMLDivElement>, private rd: Renderer2, private cdRef: ChangeDetectorRef) { }

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
    // console.log(this.listRef)
  }

  items: any[] = []
  @Input() readonly listRef: any
  @Input() readonly viewPortCount = 4
  @Output() readonly selectedIndexChange = new EventEmitter<number>()

  @ViewChild('floGridContainer') readonly gridContainer: ElementRef<HTMLDivElement>
  @ViewChildren('floGridItemContainer') readonly gridItemContainers: QueryList<ElementRef<HTMLDivElement>>
  @ContentChild(FloVideoGridItemSomeDirective, { read: TemplateRef }) readonly gridItemSomeTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloVideoGridItemNoneDirective, { read: TemplateRef }) readonly gridItemNoneTemplate: TemplateRef<HTMLElement>

  public readonly trackByFn = (_: number, item?: any) =>
    maybe(item).flatMapAuto(a => a.value).flatMapAuto(c => `${_}_${c.src}`).valueOrUndefined()

  get viewItems() {
    return new Array<any>(this.viewPortCount).fill(undefined).map((val, idx) => {
      return this.items[idx]
        ? this.items[idx]
        : val
    }).map((value, idx) => {
      return {
        hasSomething: value ? true : false,
        selected: this.selectedIndex === idx,
        value
      }
    })
  }

  public setItem(item: any) {
    // tslint:disable-next-line: no-object-mutation
    this.items[this.selectedIndex] = item
    this.cdRef.markForCheck()
  }

  readonly fillTo = (n: number) => new Array<string>(n).fill('1fr ').reduce((acc, curr) => acc + curr, '').trimRight()

  ngAfterViewInit() {
    // console.log(this.listRef.items)
    // this.gridItemContainers.changes.subscribe(console.log)
    this.updateGridStyles(this.gridItemContainers.length)
    this.gridItemContainers.changes.subscribe(a => {
      this.updateGridStyles(a.length)
    })
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

          chunk(groups, children).forEach((coll, groupIdx) => {
            coll.forEach((val, idx) => {
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
