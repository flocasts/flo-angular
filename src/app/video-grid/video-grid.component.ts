import {
  Component, Directive, ChangeDetectionStrategy, ContentChild,
  Input, TemplateRef, ElementRef, SimpleChanges, OnChanges, ViewChild, Renderer2, ViewChildren, QueryList, ChangeDetectorRef
} from '@angular/core'
import { IMaybe } from 'typescript-monads'

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

@Component({
  selector: 'flo-video-grid',
  templateUrl: './video-grid.component.html',
  styleUrls: ['./video-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoGridComponent<TItem extends IFloGridItem> implements OnChanges {
  constructor(private elmRef: ElementRef<HTMLDivElement>, private rd: Renderer2, private cdRef: ChangeDetectorRef) { }

  // tslint:disable-next-line:readonly-keyword
  @Input() selectedIndex = 0
  @Input() readonly items: ReadonlyArray<IMaybe<TItem>> = []

  @ViewChild('floGridContainer') readonly gridContainer: ElementRef<HTMLDivElement>
  @ViewChildren('floGridItemContainer') readonly gridItemContainers: QueryList<ElementRef<HTMLDivElement>>
  @ContentChild(FloVideoGridItemSomeDirective, { read: TemplateRef }) readonly gridItemSomeTemplate: TemplateRef<HTMLElement>
  @ContentChild(FloVideoGridItemNoneDirective, { read: TemplateRef }) readonly gridItemNoneTemplate: TemplateRef<HTMLElement>

  public readonly trackByFn = (_: number, item: TItem) => item.id

  get viewItems() {
    return this.items.map((item, idx) => {
      const value = item.valueOrUndefined()
      return {
        hasSomething: value ? true : false,
        selected: this.selectedIndex === idx,
        value
      }
    })
  }

  ngOnChanges(change: SimpleChanges) {
    // tslint:disable-next-line:no-if-statement
    if (!change.items.firstChange) {
      const items = change.items.currentValue as ReadonlyArray<IMaybe<TItem>>
      // console.log(items.length)
      // this.updateGridStyles(items.length)
    }
  }

  readonly fillTo = (n: number) => new Array<string>(n).fill('1fr ').reduce((acc, curr) => acc + curr, '').trimRight()

  ngAfterViewInit() {
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

          const groups = Math.ceil(children.length / gridCounts.columns)


          children.forEach((val, idx) => {
            // console.log('MOD: ', groups % idx + 1)
            if (idx === 0) {
              this.rd.setStyle(val, 'grid-area', `2 / ${idx + 1} / span 2 / span 2`)
            } else {
              this.rd.setStyle(val, 'grid-area', `2 / ${idx + 2} / span 2 / span 2`)
            }
            this.rd.setStyle(val, 'align-self', 'center')
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

  readonly findMaxSquare = (num: number) => {
    if (num === 1 || num === 2) return num
    return Math.sqrt(num) % 1 === 0
      ? num
      : this.findMaxSquare(num + 1)
  }


  readonly calcNumRowsColumns = (n: number) => {
    const squared = Math.sqrt(n)
    const columns = Math.ceil(squared)
    const rows = Math.floor(squared)
    const mod = n % squared
    const maxSquare = this.findMaxSquare(n)
    const shouldFill = mod < 1 && mod !== 0 || n + columns <= maxSquare
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
