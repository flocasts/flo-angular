import { Component, ChangeDetectionStrategy, Input, Directive, ContentChild, TemplateRef, Inject } from '@angular/core'
import { FloGridTilesComponent } from '../grid/grid-tiles.component'
import { FLO_GRID_LIST_GUID_GEN } from '../ng-grid-list.tokens'

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
export class FloGridListComponent<TItem> {
  constructor(@Inject(FLO_GRID_LIST_GUID_GEN) private guid: any) { }

  // tslint:disable-next-line: readonly-keyword
  private _items: ReadonlyArray<TItem> = []

  @Input()
  private get items() {
    return this._items
  }
  private set items(val: ReadonlyArray<TItem>) {
    // tslint:disable-next-line: no-object-mutation
    this._items = val.map(v => {
      return {
        ...v,
        id: this.guid()
      }
    })
  }

  @Input()
  readonly gridTileRef: FloGridTilesComponent

  @ContentChild(FloGridListItemDirective, { read: TemplateRef })
  readonly itemTemplate?: TemplateRef<TItem>

  trackByFn(idx: number, _item: TItem) {
    return idx
  }

  get viewItems() {
    return this.items
  }
}
