import { VideoGridComponent, IFloGridItem } from '../video-grid/video-grid.component'
import { Subject } from 'rxjs'
import { share, takeUntil } from 'rxjs/operators'
import {
  Component, ChangeDetectionStrategy, ContentChild, TemplateRef,
  Directive, ElementRef, Input, ChangeDetectorRef, AfterViewInit, OnDestroy
} from '@angular/core'

export interface IFloVideoGridListViewItem<TItem extends IFloGridItem> {
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
  selector: '[floVideoGridListItem]'
})
export class FloVideoGridListItemSomeDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}

@Component({
  selector: 'flo-video-grid-list',
  templateUrl: './video-grid-list.component.html',
  styleUrls: ['./video-grid-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloVideoGridListComponent<TItem extends IFloGridItem> implements AfterViewInit, OnDestroy {
  constructor(private cd: ChangeDetectorRef) { }

  @Input() readonly items: ReadonlyArray<TItem> = []
  @Input() readonly gridRef: VideoGridComponent<TItem>
  @ContentChild(FloVideoGridListItemSomeDirective, { read: TemplateRef }) readonly itemTemplate: any

  private readonly onDestroySource = new Subject()
  private readonly onDestroy = this.onDestroySource.pipe(share())
  public readonly trackByFn = (_: number, item: TItem) => item.id

  ngAfterViewInit() {
    this.gridRef.ticked.pipe(takeUntil(this.onDestroy)).subscribe(() => this.cd.markForCheck())
  }

  ngOnDestroy() {
    this.onDestroySource.next()
    this.onDestroySource.complete()
  }

  get viewItems(): ReadonlyArray<IFloVideoGridListViewItem<TItem>> {
    const selectedId = this.gridRef.getSelectedItem().map(a => a.id)
    return this.items.map(item => {
      const selected = selectedId.valueOrUndefined() === item.id
      const maybeSelectedIndex = this.gridRef.findIndexByItemId(item.id)
      const inAnotherSquare = maybeSelectedIndex.map(() => true).valueOr(false)

      return {
        item,
        selected,
        selectedIndex: maybeSelectedIndex.valueOrUndefined(),
        permissions: {
          canAdd: selectedId.map(() => false).valueOr(true) && !inAnotherSquare,
          canRemove: selected,
          canReplace: !selected && selectedId.valueOrUndefined() !== undefined,
          canSwap: !selected && inAnotherSquare,
        },
        actions: {
          add: () => this.gridRef.setItem(item),
          replace: () => this.gridRef.setItem(item),
          remove: () => this.gridRef.removeItem(),
          swap: () => maybeSelectedIndex.tapSome(idx => this.gridRef.swapWithCurrent(idx))
        }
      }
    })
  }
}
