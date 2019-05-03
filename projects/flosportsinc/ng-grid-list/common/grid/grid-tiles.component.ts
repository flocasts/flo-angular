import { Component, ChangeDetectionStrategy, Input, Output, Inject, PLATFORM_ID } from '@angular/core'
import {
  FLO_GRID_LIST_DEFAULT_VIEWCOUNT, FLO_GRID_LIST_MIN_VIEWCOUNT, FLO_GRID_LIST_MAX_VIEWCOUNT,
  FLO_GRID_LIST_OVERLAY_ENABLED,
  FLO_GRID_LIST_OVERLAY_FADEOUT,
  FLO_GRID_LIST_OVERLAY_THROTTLE
} from '../ng-grid-list.tokens'
import { Subject } from 'rxjs'
import { isPlatformServer } from '@angular/common'

// tslint:disable: no-object-mutation
// tslint:disable: readonly-keyword
// tslint:disable: no-if-statement

@Component({
  selector: 'flo-grid-tiles',
  templateUrl: './grid-tiles.component.html',
  styleUrls: ['./grid-tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloGridTilesComponent {
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(FLO_GRID_LIST_DEFAULT_VIEWCOUNT) private _count: number,
    @Inject(FLO_GRID_LIST_MIN_VIEWCOUNT) private _min: number,
    @Inject(FLO_GRID_LIST_MAX_VIEWCOUNT) private _max: number,
    @Inject(FLO_GRID_LIST_OVERLAY_ENABLED) private _overlayEnabled: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_ENABLED) private _overlayStart: boolean,
    @Inject(FLO_GRID_LIST_OVERLAY_FADEOUT) private _overlayFadeout: number,
    @Inject(FLO_GRID_LIST_OVERLAY_THROTTLE) private _overlayThrottle: number
  ) { }

  @Input()
  get count() {
    return this._count
  }
  set count(val: number) {
    if (val >= this._min && val <= this._max) {
      this._count = val
      this.countChange.next(this._count)
    }
  }

  public setCount(count: number) {
    this.count = count
  }

  @Input()
  get min() {
    return this._count
  }
  set min(val: number) {
    this._count = val
    this.minChange.next(this._count)
  }

  public setMin(min: number) {
    this.min = min
  }

  @Input()
  get max() {
    return this._max
  }
  set max(val: number) {
    this._max = val
    this.maxChange.next(this._max)
  }

  public setMax(min: number) {
    this.max = min
  }

  @Output() readonly countChange = new Subject<number>()
  @Output() readonly minChange = new Subject<number>()
  @Output() readonly maxChange = new Subject<number>()

  public hideOverlay$ = isPlatformServer(this.platformId)
}
