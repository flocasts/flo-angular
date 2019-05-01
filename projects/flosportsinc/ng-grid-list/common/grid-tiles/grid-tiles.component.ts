import { Component, ChangeDetectionStrategy, Input, Output, Inject } from '@angular/core'
import { FLO_GRID_LIST_VIEWCOUNT } from '../tokens'
import { Subject } from 'rxjs'

// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword

@Component({
  selector: 'flo-grid-tiles',
  templateUrl: './grid-tiles.component.html',
  styleUrls: ['./grid-tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloGridTilesComponent {
  constructor(@Inject(FLO_GRID_LIST_VIEWCOUNT) private _viewcount: number) { }

  @Input()
  get viewcount() {
    return this._viewcount
  }
  set viewcount(val: number) {
    this._viewcount = val
    this.viewcountChange.next(val)
  }


  @Output() readonly viewcountChange = new Subject<number>()
}
