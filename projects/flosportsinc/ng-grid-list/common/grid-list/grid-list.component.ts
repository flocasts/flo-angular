import { Component, ChangeDetectionStrategy, Input, Directive, ContentChild, TemplateRef } from '@angular/core'
import { FloGridTilesComponent } from '../grid-tiles/grid-tiles.component'

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
  @Input()
  readonly items: ReadonlyArray<TItem> = []

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
