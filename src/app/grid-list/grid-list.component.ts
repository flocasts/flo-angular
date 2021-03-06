import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core'
import { isIphone } from '@flosportsinc/ng-fullscreen'
import {
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED, DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR, DEFAULT_FLO_GRID_LIST_MAX_HEIGHT,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_ENABLED, DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD,
  DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT, DEFAULT_FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_LISTS_ENABLED, DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT, DEFAULT_FLO_GRID_LIST_MIN_VIEWCOUNT,
  DEFAULT_FLO_GRID_LIST_OVERLAY_ENABLED, DEFAULT_FLO_GRID_LIST_OVERLAY_STATIC,
  DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT, DEFAULT_FLO_GRID_LIST_FILL_TO_FIT
} from '@flosportsinc/ng-grid-list'

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridListComponent {
  // tslint:disable-next-line: readonly-keyword
  public items: ReadonlyArray<any> = [
    // tslint:disable: max-line-length
    { id: '123', src: 'https://cdn-flo.flodogs.com/uploaded/mzEp5zBJ943XvZXba7DnVmvD2zZPqJk6/playlist.m3u8', dragImage: 'https://d16w8nkko3rzy2.cloudfront.net/16200/thumbnail.jpg?ts=1564790375' } as any,
    { id: '789', src: 'https://cdn-flo.flowrestling.org/uploaded/G3op3lQBy394D561vB33By4ZWB2dqD7V/playlist.m3u8', dragImage: 'https://d16w8nkko3rzy2.cloudfront.net/18671/thumbnail.jpg?ts=1564668622' },
    { id: '456', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
    { id: '000', src: 'https://cdn-flo.flowrestling.org/uploaded/xnJpnlmxVj0ZX3d17gLJDPaewJ2dYBv3/playlist.m3u8' },
    { id: 'wut', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4' }
  ]

  readonly initialFill = { 0: '789', 3: 'wut' }
  // tslint:disable: readonly-keyword

  @ViewChild('gridRef', { read: ElementRef }) gridref: ElementRef<HTMLElement>

  currentElm: HTMLElement

  elmChange(evt: HTMLElement) {
    // tslint:disable-next-line: no-object-mutation
    this.currentElm = evt
  }

  get fsElementRef() {
    return isIphone()
      ? this.currentElm
      : this.gridref.nativeElement
  }

  public selectNextEmptyOnCount = DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT
  public selectNextEmptyOnAdd = DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD
  public selectFromLowerIndicesFirst = DEFAULT_FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST
  public dragDropEnabled = DEFAULT_FLO_GRID_LIST_DRAG_DROP_ENABLED
  public dragDropListsEnabled = DEFAULT_FLO_GRID_LIST_DRAG_DROP_LISTS_ENABLED
  public dragDropHoverBgEnabled = DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED
  public dragDropHoverBgColor = DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR
  public dragDropHoverBgOpacity = DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY
  public count = DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT
  public min = DEFAULT_FLO_GRID_LIST_MIN_VIEWCOUNT
  public max = DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT
  public overlayEnabled = DEFAULT_FLO_GRID_LIST_OVERLAY_ENABLED
  public overlayStatic = DEFAULT_FLO_GRID_LIST_OVERLAY_STATIC
  public fillToFit = DEFAULT_FLO_GRID_LIST_FILL_TO_FIT
  public maxheight = DEFAULT_FLO_GRID_LIST_MAX_HEIGHT
}
