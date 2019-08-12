import { FloGridListViewComponent } from '../grid/grid.component'
import { FLO_GRID_LIST_GUID_GEN, IFloGridListBaseItem, FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD } from '../ng-grid-list.tokens'
import { Subject } from 'rxjs'
import { maybe } from 'typescript-monads'
import { takeUntil } from 'rxjs/operators'
import {
  Component, ChangeDetectionStrategy, Input, Directive, ContentChild,
  TemplateRef, Inject, Output, ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

export interface IFloGridListViewItemRoles {
  readonly isSelected: boolean
  readonly isInAnother: boolean
  readonly canAdd: boolean
  readonly canRemoveSelf: boolean
  readonly canRemove: boolean
  readonly canReplace: boolean
  readonly canSwap: boolean
  readonly canSelect: boolean
}

export interface IFloGridListViewItemActions {
  readonly select: () => void
  readonly add: () => void
  readonly remove: () => void
  readonly removeSelf: () => void
  readonly replace: () => void
  readonly swap: () => void
}

export interface IFloGridListViewItem<TItem extends IFloGridListBaseItem> {
  readonly item: TItem
  readonly roles: IFloGridListViewItemRoles
  readonly actions: IFloGridListViewItemActions
}

export const noop = () => { }

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
  constructor(private _cdRef: ChangeDetectorRef,
    @Inject(FLO_GRID_LIST_GUID_GEN) private guid: any,
    @Inject(FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD) private _autoFillOnLoad: boolean
  ) { }

  private _items: ReadonlyArray<TItem> = []
  private _initialFill = {}
  private _itemsNgClass = {}
  private _itemsNgStyle = {}

  @Input()
  get items() {
    return this._items
  }
  set items(val: ReadonlyArray<TItem>) {
    this._items = val.map(v => {
      return {
        ...v,
        id: v.id || this.guid()
      }
    })
  }

  @Input()
  get autoFillOnLoad() {
    return this._autoFillOnLoad
  }
  set autoFillOnLoad(autofill: boolean) {
    this._autoFillOnLoad = autofill
  }

  @Input()
  get initialFill() {
    return this._initialFill
  }
  set initialFill(initialFill: Object) {
    this._initialFill = initialFill || {}
  }

  @Input()
  get itemsNgClass() {
    return this._itemsNgClass
  }
  set itemsNgClass(ngClass: object) {
    this._itemsNgClass = ngClass
    this.itemsNgClassChange.next(ngClass)
  }

  @Input()
  get itemsNgStyle() {
    return this._itemsNgStyle
  }
  set itemsNgStyle(ngstyle: object) {
    this._itemsNgStyle = ngstyle
    this.itemsNgStyleChange.next(ngstyle)
  }

  private generateItemRoles = (grid: FloGridListViewComponent<TItem>, item: TItem): IFloGridListViewItemRoles => {
    return {
      isSelected: grid.isIdSelected(item.id),
      isInAnother: grid.isItemInAnotherIndex(item, grid.selectedIndex),
      canAdd: grid.canAddItem(item),
      canRemoveSelf: grid.canRemoveItemSelected(item),
      canRemove: grid.canRemoveItem(item),
      canReplace: grid.canReplaceItem(item),
      canSwap: grid.canSwapItem(item),
      canSelect: grid.canSelectItem(item)
    }
  }

  private generateDefaultItem = (item: TItem) => {
    return {
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
        removeSelf: noop,
        swap: noop
      }
    }
  }

  get viewItems(): ReadonlyArray<any> {
    return this.items.map(item => {
      return this.maybeGridRef()
        .map(grid => {
          const roles = this.generateItemRoles(grid, item)
          const itemIndexInGrid = grid.getItemIndex(item)
          return {
            item,
            roles,
            actions: {
              select: () => { roles.canSelect && grid.setSelectedIndex(itemIndexInGrid) },
              add: () => { roles.canAdd && grid.setItem(item) },
              replace: () => { roles.canReplace && grid.replaceItem(item) },
              remove: () => { roles.canRemove && grid.removeItem(item) },
              removeSelf: () => { roles.canRemoveSelf && grid.removeItem(item) },
              swap: () => { roles.canSwap && grid.swapItems(item) }
            }
          }
        })
        .valueOr(this.generateDefaultItem(item))
    })
  }

  @Output() public readonly itemsChange = new Subject<ReadonlyArray<TItem>>()
  @Output() public readonly itemsNgClassChange = new Subject<any>()
  @Output() public readonly itemsNgStyleChange = new Subject<any>()

  @Input()
  public readonly gridRef?: FloGridListViewComponent<TItem>
  public readonly maybeGridRef = () => maybe(this.gridRef)

  @ContentChild(FloGridListItemDirective, { read: TemplateRef })
  public readonly itemTemplate?: TemplateRef<TItem>

  readonly trackByFn = (_idx: number, item: TItem) => item.id

  private readonly onDestroy = new Subject()

  public readonly autoFill = () =>
    this.maybeGridRef().tapSome(grid => this.items
      .filter(i => grid.isItemNotInGrid(i))
      .forEach(i => grid.fillNextEmpty(i)))

  ngOnInit() {
    this.maybeGridRef().tapSome(grid => {
      grid.cdRefChange
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => this._cdRef.detectChanges())

      const keys = Object.keys(this.initialFill)
      if (keys.length) {
        const _items: ReadonlyArray<any> = []
        keys.forEach(key => {
          _items[key] = this.items.find(a => a.id === this.initialFill[key])
        })
        grid.setItems(_items)
      } else if (this.autoFillOnLoad) {
        this.autoFill()
      }
    })
  }

  ngOnDestroy() {
    this.onDestroy.next()
    this.onDestroy.complete()
  }
}
