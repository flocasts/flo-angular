import { FloGridTilesComponent } from '../grid/grid.component'
import { FLO_GRID_LIST_GUID_GEN, IFloGridListBaseItem } from '../ng-grid-list.tokens'
import { Subject } from 'rxjs'
import { maybe } from 'typescript-monads'
import { takeUntil } from 'rxjs/operators'
import {
  Component, ChangeDetectionStrategy, Input, Directive, ContentChild,
  TemplateRef, Inject, Output, ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core'

export interface IFloVideoGridListViewItem<TItem extends IFloGridListBaseItem> {
  readonly item: TItem
  readonly roles: {
    readonly isSelected: boolean
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

const noop = () => { }

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
    //   actions: {
    //     //   add: () => this.gridRef.setItem(item),
    //     //   replace: () => this.gridRef.setItem(item),
    //     //   remove: () => this.gridRef.removeItem(),
    //     //   swap: () => maybeSelectedIndex.tapSome(idx => this.gridRef.swapWithCurrent(idx))
    //   }

    return this.items.map(item => {
      return this.maybeGridRef()
        .map(grid => {
          const isSelected = grid.selectedId === item.id
          const itemIndexInGrid = grid.getItemIndex(item.id)
          const isItemInGrid = grid.isItemInGrid(item.id)
          const isInView = itemIndexInGrid >= 0 && itemIndexInGrid < grid.count
          const currentSelectedIndex = grid.selectedIndex
          const isInAnother = grid.isItemInAnotherIndex(item.id, currentSelectedIndex)

          const isNotSelected = !isSelected
          const canSelect = isInView && isNotSelected
          const canSwap = isNotSelected && isInAnother
          const canRemoveSelf = isSelected
          const canRemove = isItemInGrid
          const canAdd = !isItemInGrid && !isInAnother
          const canReplace = isNotSelected && itemIndexInGrid >= 0
          return {
            item,
            roles: {
              isSelected,
              isInAnother,
              canAdd,
              canRemoveSelf,
              canRemove,
              canReplace,
              canSwap,
              canSelect
            },
            actions: {
              select: () => isInView && grid.setSelectedIndex(itemIndexInGrid),
              add: () => { canAdd && 1 }, // TODO
              replace: () => { canReplace && 1 }, // TODO
              remove: () => { canRemove && 1 }, // TODO
              swap: () => { canSwap && 1 } // TODO
            }
          }
        })
        .valueOr({
          item,
          roles: {
            isSelected: false,
            isInAnother: false,
            canAdd: false,
            canRemoveSelf: false,
            canRemove: false,
            canReplace: false,
            canSwap: false,
            canSelect: false
          },
          actions: {
            select: noop,
            add: noop,
            replace: noop,
            remove: noop,
            swap: noop
          }
        })
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
      grid.cdRefChange
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => this._cdRef.detectChanges())
    })
  }

  ngOnDestroy() {
    this.onDestroy.next()
    this.onDestroy.complete()
  }
}
