import { FloGridTilesComponent } from '../grid/grid.component'
import { FLO_GRID_LIST_GUID_GEN, IFloGridListBaseItem } from '../ng-grid-list.tokens'
import { Subject, merge } from 'rxjs'
import { maybe } from 'typescript-monads'
import { takeUntil } from 'rxjs/operators'
import {
  Component, ChangeDetectionStrategy, Input, Directive, ContentChild,
  TemplateRef, Inject, Output, ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core'

export interface IFloVideoGridListViewItem<TItem extends IFloGridListBaseItem> {
  readonly item: TItem
  readonly selected: boolean
  readonly selectedIndex?: number
  readonly permissions: {
    readonly canAdd: boolean
    readonly canRemove: boolean
    readonly canReplace: boolean
    readonly canSwap: boolean
  }
  readonly actions: {
    readonly add: () => void
    readonly remove: () => void
    readonly replace: () => void
    readonly swap: () => void
  }
}

@Directive({
  selector: '[floGridListItem]'
})
export class FloGridListItemDirective { }

@Component({
  selector: 'flo-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloGridListComponent<TItem extends IFloGridListBaseItem> implements OnInit, OnDestroy {
  constructor(private _cdRef: ChangeDetectorRef, @Inject(FLO_GRID_LIST_GUID_GEN) private guid: any) { }

  // tslint:disable-next-line: readonly-keyword
  private _items: ReadonlyArray<TItem> = []

  @Input()
  get items() {
    return this._items
  }
  set items(val: ReadonlyArray<TItem>) {
    // tslint:disable-next-line: no-object-mutation
    this._items = val.map(v => {
      return {
        ...v,
        id: v.id || this.guid()
      }
    })
  }

  get viewItems(): ReadonlyArray<any> {
    return this.items.map(item => {
      return this.maybeGridRef()
        .map(grid => {
          const isSelected = grid.selectedId === item.id
          return {
            item,
            isSelected,
            permissions: {},
            actions: {}
          }
        })
        .valueOr({
          item,
          isSelected: false,
          permissions: {},
          actions: {}
        })

      // const itemInAnotherIndex = this.gridRef.items.findIndex()
      // const maybeSelectedIndex = this.gridRef.findIndexByItemId(item.id)
      // const inAnotherSquare = maybeSelectedIndex.map(() => true).valueOr(false)
      // const selectedIndex = maybeSelectedIndex.valueOr(-1)
      // const isValidIndex = selectedIndex >= 0 && selectedIndex <= this.gridRef.viewcount - 1

      // return {
      //   item,
      //   // isSelected,
      //   // selectedIndex,
      //   permissions: {
      //     //   canAdd: selectedId.map(() => false).valueOr(true) && !inAnotherSquare,
      //     //   canRemove: selected,
      //     //   canReplace: !selected && selectedId.valueOrUndefined() !== undefined,
      //     //   canSwap: !selected && inAnotherSquare,
      //     //   canSelect: !selected && isValidIndex
      //   },
      //   actions: {
      //     select: () => this.maybeGridRef().map(g => g.setSelectedIndex(1))
      //     // selectedIndex >= 0 && this.gridRef.setSelected(selectedIndex),
      //     //   add: () => this.gridRef.setItem(item),
      //     //   replace: () => this.gridRef.setItem(item),
      //     //   remove: () => this.gridRef.removeItem(),
      //     //   swap: () => maybeSelectedIndex.tapSome(idx => this.gridRef.swapWithCurrent(idx))
      //   }
      // }
    })
  }

  @Output()
  public readonly itemsChange = new Subject<ReadonlyArray<TItem>>()

  @Input()
  public readonly gridRef?: FloGridTilesComponent<TItem>
  public readonly maybeGridRef = () => maybe(this.gridRef)

  @ContentChild(FloGridListItemDirective, { read: TemplateRef })
  public readonly itemTemplate?: TemplateRef<TItem>

  readonly trackByFn = (_idx: number, item: TItem) => item.id

  private readonly onDestroy = new Subject()

  ngOnInit() {
    this.maybeGridRef().tapSome(grid => {
      merge(grid.selectedIdChange, grid.selectedIndexChange)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => this._cdRef.detectChanges())
    })
  }

  ngOnDestroy() {
    this.onDestroy.next()
    this.onDestroy.complete()
  }
}
