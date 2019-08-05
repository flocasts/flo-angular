import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core'
import { isIphone } from '@flosportsinc/ng-fullscreen'

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridListComponent {
  // tslint:disable-next-line: readonly-keyword
  public items: ReadonlyArray<any> = [
    { id: '123', src: 'https://cdn-flo.flodogs.com/uploaded/mzEp5zBJ943XvZXba7DnVmvD2zZPqJk6/playlist.m3u8' } as any,
    { id: '789', src: 'https://cdn-flo.flowrestling.org/uploaded/G3op3lQBy394D561vB33By4ZWB2dqD7V/playlist.m3u8' },
    { id: '456', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
    { id: '000', src: 'https://cdn-flo.flowrestling.org/uploaded/xnJpnlmxVj0ZX3d17gLJDPaewJ2dYBv3/playlist.m3u8' },
    { id: 'wut', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4' }
  ]

  readonly initialFill = { 0: '789', 3: 'wut' }
  // tslint:disable: readonly-keyword
  count = 2

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

  public selectNextEmptyOnCount = true
  public selectNextEmptyOnAdd = true
  public selectFromLowerIndicesFirst = false
  public maxheight = 600
}
