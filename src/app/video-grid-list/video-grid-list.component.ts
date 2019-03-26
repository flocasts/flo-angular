import { VideoGridComponent } from '../video-grid/video-grid.component'
import { maybe } from 'typescript-monads'
import { Subject } from 'rxjs'
import { share, takeUntil } from 'rxjs/operators'
import {
  Component, ChangeDetectionStrategy, ContentChild, TemplateRef,
  Directive, ElementRef, Input, ChangeDetectorRef, AfterViewInit, OnDestroy
} from '@angular/core'

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
export class FloVideoGridListComponent implements AfterViewInit, OnDestroy {
  constructor(private cd: ChangeDetectorRef) { }

  @Input() readonly items: ReadonlyArray<any> = []
  @Input() readonly gridRef: VideoGridComponent<any>
  @ContentChild(FloVideoGridListItemSomeDirective, { read: TemplateRef }) readonly itemTemplate: any

  private readonly onDestroySource = new Subject()
  private readonly onDestroy = this.onDestroySource.pipe(share())

  public readonly trackByFn = (_: number, item: any) => item.id

  get viewItems() {
    const selectedId = maybe(this.gridRef.getSelectedItem()).map(a => a.id)

    return this.items.map(item => {
      const selected = selectedId.valueOrUndefined() === item.id
      const maybeSelectedIndex = maybe(this.gridRef.items.findIndex(a => a && a.id === item.id)).filter(a => a >= 0)
      const inAnotherSquare = maybeSelectedIndex.filter(d => d >= 0).map(() => true).valueOr(false)
      return {
        item,
        selected,
        selectedIndex: maybeSelectedIndex.valueOrUndefined(),
        canAdd: selectedId.map(() => false).valueOr(true) && !inAnotherSquare,
        canRemove: selected,
        canReplace: !selected,
        canSwap: !selected && inAnotherSquare,
        add: () => this.gridRef.setItem(item),
        remove: () => this.gridRef.removeItem(),
        swap: () => { }
      }
    })
  }

  ngAfterViewInit() {
    this.gridRef.ticked.pipe(takeUntil(this.onDestroy)).subscribe(() => this.cd.markForCheck())
  }

  ngOnDestroy() {
    this.onDestroySource.next()
    this.onDestroySource.complete()
  }
}
