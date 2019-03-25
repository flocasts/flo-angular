import { Component, ChangeDetectionStrategy, ContentChild, TemplateRef, Directive, ElementRef, Input } from '@angular/core'
import { VideoGridComponent } from '../video-grid/video-grid.component'

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
export class FloVideoGridListComponent {

  @Input() readonly items: ReadonlyArray<any> = []
  @Input() readonly gridRef: VideoGridComponent<any>
  @ContentChild(FloVideoGridListItemSomeDirective, { read: TemplateRef }) readonly itemTemplate: any

  public readonly trackByFn = (_: number, item: any) => item.id

  // tslint:disable-next-line: readonly-keyword
  map: {
    // 1: ''
  }

  get viewItems() {
    return this.items.map(item => {
      return {
        item,
        selected: true,
        canAdd: false,
        canRemove: false,
        canSwap: false,
        canReplace: false
      }
    })
  }

  ngOnChanges(d) {
    // console.log(d)
  }

  ngAfterViewInit() {
    // console.log(this.items[this.gridRef.selectedIndex])
  }

  setItem(item: any) {
    console.log('SET ITEM', item, this.gridRef.selectedIndex)
    // tslint:disable-next-line: no-object-mutation
    this.gridRef.setItem(item)
    // this.gridRef.items[this.gridRef.selectedIndex] = item
  }
}
