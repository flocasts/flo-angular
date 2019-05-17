import { async, TestBed } from '@angular/core/testing'
import { FloGridListComponent, noop } from './grid-list.component'
import { Component, NgModule, ViewChild } from '@angular/core'
import { FloGridListModule } from '../ng-grid-list.module'
import { FloGridListViewComponent } from '../grid/grid.component'
import { maybe } from 'typescript-monads'
import { By } from '@angular/platform-browser'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
// tslint:disable: readonly-array

const SAMPLE_ITEM_1 = { id: 'id1', src: 'https://cdn-flo.flodogs.com/uploaded/mzEp5zBJ943XvZXba7DnVmvD2zZPqJk6/playlist.m3u8' }
const SAMPLE_ITEM_2 = { id: 'id2', src: 'https://cdn-flo.flowrestling.org/uploaded/G3op3lQBy394D561vB33By4ZWB2dqD7V/playlist.m3u8' }

@Component({
  selector: 'flo-grid-list-test-component',
  template: `
    <flo-grid-list-view #grid>
      <div *floGridListOverlay>Overlay controls go here</div>
      <div *floGridListItemSome="let item">{{ item.value.value }}</div>
      <div *floGridListItemNone>EMPTY</div>
    </flo-grid-list-view>
    <flo-grid-list [gridRef]="grid" [(items)]="items" [autoFillOnLoad]="autoFillOnLoad" [initialFill]="initialFill">
    </flo-grid-list>
  `
})
export class FloGridListTestComponent {
  @ViewChild(FloGridListComponent) _listRef: FloGridListComponent<any>
  @ViewChild(FloGridListViewComponent) _gridRef: FloGridListViewComponent<any>
  items = [
    SAMPLE_ITEM_1,
    SAMPLE_ITEM_2,
    { id: 'id3', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
    { id: 'id4', src: 'https://cdn-flo.flowrestling.org/uploaded/xnJpnlmxVj0ZX3d17gLJDPaewJ2dYBv3/playlist.m3u8' },
    { id: 'id5', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4' }
  ]
  autoFillOnLoad = false
  initialFill: any
}

@NgModule({
  imports: [FloGridListModule],
  declarations: [FloGridListTestComponent]
})
export class FloGridTestingModule { }

const createSut = () => {
  const hoistFixture = TestBed.createComponent(FloGridListTestComponent)
  const gridListDebug = hoistFixture.debugElement.query(By.directive(FloGridListComponent))
  const gridDebug = hoistFixture.debugElement.query(By.directive(FloGridListViewComponent))
  hoistFixture.detectChanges()
  return {
    hoistFixture,
    hoistInstance: hoistFixture.componentInstance,
    gridListDebug,
    gridDebug
  }
}

describe(FloGridListComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloGridTestingModule]
    }).compileComponents()
  }))

  it('should create', () => {
    const sut = createSut()
    expect(sut.hoistInstance._gridRef).toBeTruthy()
    expect(sut.hoistInstance._listRef).toBeTruthy()
  })

  describe('viewItems', () => {
    noop() // coverage
    it('should return default empty item when not connected to grid', () => {
      const sut = createSut()
      spyOn(sut.hoistInstance._listRef, 'maybeGridRef').and.callFake(() => maybe())
      sut.hoistFixture.detectChanges()
      Object.values(sut.hoistInstance._listRef.viewItems[0].roles).forEach(val => expect(val).toEqual(false))
      Object.values(sut.hoistInstance._listRef.viewItems[0].actions).forEach(action => expect(action).toEqual(noop))
    })
  })

  describe('autoFillOnLoad', () => {
    it('should be true', () => {
      const sut = createSut()
      sut.hoistInstance.autoFillOnLoad = true
      sut.hoistFixture.detectChanges()
      expect(sut.hoistInstance._listRef.autoFillOnLoad).toEqual(true)
    })
    it('should be true', () => {
      const sut = createSut()
      sut.hoistInstance.autoFillOnLoad = false
      sut.hoistFixture.detectChanges()
      expect(sut.hoistInstance._listRef.autoFillOnLoad).toEqual(false)
    })

    it('should call autofill', () => {
      const sut = createSut()
      const spy = spyOn(sut.hoistInstance._listRef, 'autoFill').and.callThrough()
      sut.hoistInstance.autoFillOnLoad = true
      sut.hoistFixture.detectChanges()
      sut.hoistInstance._listRef.ngOnInit()
      expect(sut.hoistInstance._listRef.autoFillOnLoad).toEqual(true)
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('initialFill', () => {
    it('should pass input', () => {
      const sut = createSut()
      sut.hoistInstance.initialFill = { 1: 'id5' }
      sut.hoistFixture.detectChanges()
      expect(sut.hoistInstance._listRef.initialFill).toEqual(sut.hoistInstance.initialFill)
    })
    it('should fill', () => {
      const sut = createSut()
      const spy = spyOn(sut.hoistInstance._gridRef, 'setItems').and.callThrough()
      sut.hoistInstance.initialFill = { 1: 'id1' }
      sut.hoistFixture.detectChanges()
      sut.hoistInstance._listRef.ngOnInit()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith([undefined, SAMPLE_ITEM_1])
    })

    it('should fill n-times', () => {
      const sut = createSut()
      const spy = spyOn(sut.hoistInstance._gridRef, 'setItems').and.callThrough()
      sut.hoistInstance.initialFill = { 0: 'id2', 1: 'id1' }
      sut.hoistFixture.detectChanges()
      sut.hoistInstance._listRef.ngOnInit()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith([SAMPLE_ITEM_2, SAMPLE_ITEM_1])
    })
  })
})
