import { async, TestBed } from '@angular/core/testing'
import { FloGridListViewComponent } from './grid.component'
import { FloGridListModule } from '../ng-grid-list.module'
import { DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT } from '../ng-grid-list.module.defaults'
import { take } from 'rxjs/operators'
import { PLATFORM_ID, Component, NgModule } from '@angular/core'
import { By } from '@angular/platform-browser'
import {
  FLO_GRID_LIST_MIN_COUNT, FLO_GRID_LIST_MAX_COUNT, FLO_GRID_LIST_OVERLAY_ENABLED,
  FLO_GRID_LIST_OVERLAY_START, FLO_GRID_LIST_OVERLAY_FADEOUT, FLO_GRID_LIST_OVERLAY_THROTTLE,
  FLO_GRID_LIST_MAX_HEIGHT, FLO_GRID_LIST_SELECTED_INDEX, FLO_GRID_LIST_OVERLAY_STATIC,
  FLO_GRID_LIST_ITEMS, FLO_GRID_LIST_DRAG_DROP_ENABLED
} from '../ng-grid-list.tokens'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
// tslint:disable: readonly-array
@Component({
  selector: 'flo-grid-list-view-test-component',
  template: `
    <flo-grid-list-view [(count)]="count" [items]="items">
      <div *floGridListOverlay>
        Overlay controls go here
      </div>
      <div *floGridListItemSome="let item">{{ item.value.value }}</div>
      <div *floGridListItemNone>EMPTY</div>
    </flo-grid-list-view>
  `
})
export class FloGridTilesTestComponent {
  count = 1
  items = []
}

@NgModule({
  imports: [FloGridListModule],
  declarations: [FloGridTilesTestComponent]
})
export class FloGridTestingModule { }

const createSut = () => {
  const hoistFixture = TestBed.createComponent(FloGridTilesTestComponent)
  const fixture = hoistFixture.debugElement.query(By.directive(FloGridListViewComponent))
  hoistFixture.detectChanges()
  return {
    hoistFixture,
    hoistInstance: fixture.componentInstance,
    fixture,
    instance: fixture.componentInstance as FloGridListViewComponent<any>
  }
}

const testInputProperty = (prop: string, testValue: any, ) => {
  const sut = TestBed.createComponent(FloGridListViewComponent)
  sut.componentInstance[prop] = testValue
  expect(sut.componentInstance[prop]).toEqual(testValue)
  sut.componentInstance[`${prop}Change`].toPromise().then((ve: number) => expect(ve).toEqual(testValue))
}

const testInputPropSetFunc = (prop: string, prop2: string, num: any) => {
  const sut = createSut().instance
  sut[prop2](num)
  expect(sut[prop]).toEqual(num)
  sut[`${prop}Change`].toPromise().then((ve: number) => expect(ve).toEqual(num))
}

const setupCountSomeNoneTests = (count: number, items: any[] = []) => {
  const sut = createSut()
  sut.hoistInstance.items = items
  sut.hoistInstance.count = count
  sut.hoistFixture.detectChanges()

  return sut.instance.gridItemContainers.toArray()
}

describe(FloGridListViewComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloGridTestingModule, FloGridListModule.config({
        overlay: {
          throttle: 6000,
          fadeout: 1
        }
      })]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(createSut().instance).toBeTruthy()
  })

  describe('count property', () => {
    it('should double bind', () => testInputProperty('count', 10))

    it('should expose setViewcount()', () => {
      testInputPropSetFunc('count', 'setCount', 13)
    })

    it('should handle out of bounds value is set below minimum', () => {
      const sut = TestBed.createComponent(FloGridListViewComponent)
      const testNumber = 0

      sut.componentInstance.setCount(testNumber)
      sut.detectChanges()
      expect(sut.componentInstance.count).toEqual(DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT)
      sut.componentInstance.countChange.toPromise().then(ve => expect(ve).toEqual(DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT))
    })

    it('should handle out of bounds when value is set above maximum', () => {
      const sut = TestBed.createComponent(FloGridListViewComponent)
      const testNumber = 64

      sut.componentInstance.setCount(testNumber)
      sut.detectChanges()
      expect(sut.componentInstance.count).toEqual(DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT)
      sut.componentInstance.countChange.toPromise().then(ve => expect(ve).toEqual(DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT))
    })
  })

  describe('min property', () => {
    it('should double bind', () => testInputProperty('min', 4))
    it('should expose setter function', () => testInputPropSetFunc('min', 'setMin', 4))
    it('should start with token value', () => expect(createSut().instance.min).toEqual(TestBed.get(FLO_GRID_LIST_MIN_COUNT)))
  })

  describe('max property', () => {
    it('should double bind', () => testInputProperty('max', 52))
    it('should expose setter function', () => testInputPropSetFunc('max', 'setMax', 52))
    it('should start with token value', () => expect(createSut().instance.max).toEqual(TestBed.get(FLO_GRID_LIST_MAX_COUNT)))
  })

  describe('maxheight property', () => {
    it('should double bind', () => testInputProperty('maxheight', 400))
    it('should expose setter function', () => testInputPropSetFunc('maxheight', 'setMaxheight', 400))
    it('should start with token value', () => expect(createSut().instance.maxheight).toEqual(TestBed.get(FLO_GRID_LIST_MAX_HEIGHT)))
  })

  describe('selectedId property', () => {
    it('should double bind', () => testInputProperty('selectedId', 'awesome-id'))
    it('should expose setter function', () => testInputPropSetFunc('selectedId', 'setSelectedId', 'awesome-id'))
  })

  describe('selectedIndex property', () => {
    it('should double bind', () => testInputProperty('selectedIndex', 0))
    it('should expose setter function', () => testInputPropSetFunc('selectedIndex', 'setSelectedIndex', 0))
    it('should start with token value', () => expect(createSut().instance.selectedIndex).toEqual(TestBed.get(FLO_GRID_LIST_SELECTED_INDEX)))
    it('should not set out of bounds', () => {
      const sut = createSut().instance
      const originalIndex = sut.selectedIndex
      sut.count = 4
      sut.setSelectedIndex(100)
      expect(sut.selectedIndex).toEqual(originalIndex)

      sut.setSelectedIndex(3)
      expect(sut.selectedIndex).toEqual(3)

      sut.setSelectedIndex(3)
      sut.count = 3
      expect(sut.selectedIndex).toEqual(0)

      const originalIndex1 = sut.selectedIndex
      sut.setSelectedIndex(-1)
      expect(sut.selectedIndex).toEqual(originalIndex1)
    })
    it('should not go out of visual bounds', () => {
      const sut = createSut().instance
      sut.count = 4
      sut.selectedIndex = 3
      sut.count = 1
      expect(sut.selectedIndex).toEqual(0)
    })
  })

  describe('overlayEnabled property', () => {
    it('should double bind', () => testInputProperty('overlayEnabled', false))
    it('should expose setter function', () => testInputPropSetFunc('overlayEnabled', 'setOverlayEnabled', false))
    it('should start with token value',
      () => expect(createSut().instance.overlayEnabled).toEqual(TestBed.get(FLO_GRID_LIST_OVERLAY_ENABLED)))
  })

  describe('overlayStatic property', () => {
    it('should double bind', () => testInputProperty('overlayStatic', true))
    it('should expose setter function', () => testInputPropSetFunc('overlayStatic', 'setOverlayStatic', true))
    it('should start with token value',
      () => expect(createSut().instance.overlayStatic).toEqual(TestBed.get(FLO_GRID_LIST_OVERLAY_STATIC)))
  })

  describe('overlayStart property', () => {
    it('should double bind', () => testInputProperty('overlayStart', false))
    it('should expose setter function', () => testInputPropSetFunc('overlayStart', 'setOverlayStart', false))
    it('should start with token value', () => expect(createSut().instance.overlayStart).toEqual(TestBed.get(FLO_GRID_LIST_OVERLAY_START)))
  })

  describe('overlayFadeout property', () => {
    it('should double bind', () => testInputProperty('overlayFadeout', 76))
    it('should expose setter function', () => testInputPropSetFunc('overlayFadeout', 'setOverlayFadeout', 76))
    it('should start with token value',
      () => expect(createSut().instance.overlayFadeout).toEqual(TestBed.get(FLO_GRID_LIST_OVERLAY_FADEOUT)))
  })
  describe('overlayThrottle property', () => {
    it('should double bind', () => testInputProperty('overlayThrottle', 4))
    it('should expose setter function', () => testInputPropSetFunc('overlayThrottle', 'setOverlayThrottle', 4))
    it('should start with token value',
      () => expect(createSut().instance.overlayThrottle).toEqual(TestBed.get(FLO_GRID_LIST_OVERLAY_THROTTLE)))
  })

  describe('overlayNgClass property', () => {
    it('should double bind', () => testInputProperty('overlayNgClass', { 'someClass': true }))
    it('should expose setter function', () => testInputPropSetFunc('overlayNgClass', 'setOverlayNgClass', { 'someClass': true }))
    it('should start with token value',
      () => expect(createSut().instance.overlayThrottle).toEqual(TestBed.get(FLO_GRID_LIST_OVERLAY_THROTTLE)))
  })

  describe('overlayNgStyle property', () => {
    it('should double bind', () => testInputProperty('overlayNgStyle', { 'color': 'white' }))
    it('should expose setter function', () => testInputPropSetFunc('overlayNgStyle', 'setOverlayNgStyle', { 'color': 'white' }))
    it('should start with token value',
      () => expect(createSut().instance.overlayThrottle).toEqual(TestBed.get(FLO_GRID_LIST_OVERLAY_THROTTLE)))
  })

  describe('dragDropEnabled property', () => {
    it('should double bind', () => testInputProperty('dragDropEnabled', false))
    it('should expose setter function', () => testInputPropSetFunc('dragDropEnabled', 'setDragDropEnabled', false))
    it('should start with token value',
      () => expect(createSut().instance.dragDropEnabled).toEqual(TestBed.get(FLO_GRID_LIST_DRAG_DROP_ENABLED)))
  })

  describe('items property', () => {
    it('should double bind', () => testInputProperty('items', [{ id: '1' }]))
    it('should expose setter function', () => testInputPropSetFunc('items', 'setItems', [{ id: '1' }]))
    it('should start with token value', () => expect(createSut().instance.items).toEqual(TestBed.get(FLO_GRID_LIST_ITEMS)))
  })

  describe('when count equals 1', () => {
    it('should show 1 empty', () => {
      const result = setupCountSomeNoneTests(1, [])
      expect(result.length).toEqual(1)
      expect(result[0].nativeElement.innerText).toEqual('EMPTY')
    })
    it('should show 1 filled', () => {
      const result = setupCountSomeNoneTests(1, [{ id: '1', value: 'SOME_VALUE' }])
      expect(result.length).toEqual(1)
      expect(result[0].nativeElement.innerText).toEqual('SOME_VALUE')
    })
  })

  describe('when count equals 2', () => {
    it('should show 2 empty', () => {
      const result = setupCountSomeNoneTests(2, [])
      expect(result.length).toEqual(2)
      expect(result[0].nativeElement.innerText).toEqual('EMPTY')
      expect(result[1].nativeElement.innerText).toEqual('EMPTY')
    })
    it('should show 1 empty, 1 filled', () => {
      const result = setupCountSomeNoneTests(2, [undefined, { id: '1', value: 'SOME_VALUE' }])
      expect(result.length).toEqual(2)
      expect(result[0].nativeElement.innerText).toEqual('EMPTY')
      expect(result[1].nativeElement.innerText).toEqual('SOME_VALUE')
    })
    it('should show 2 filled', () => {
      const result = setupCountSomeNoneTests(2, [{ id: '1', value: 'SOME_VALUE_1' }, { id: '2', value: 'SOME_VALUE_2' }])
      expect(result.length).toEqual(2)
      expect(result[0].nativeElement.innerText).toEqual('SOME_VALUE_1')
      expect(result[1].nativeElement.innerText).toEqual('SOME_VALUE_2')
    })
  })

  describe('overlay', () => {
    it('should be shown on platform browser', () => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [FloGridListModule],
        declarations: [FloGridTilesTestComponent]
      }).compileComponents()
      const sut = createSut()
      const mousemove = new MouseEvent('mousemove')
      sut.fixture.nativeElement.dispatchEvent(mousemove)
      sut.instance.showOverlay.pipe(take(1)).subscribe(res => {
        expect(res).toEqual(true)
      })
      sut.instance.hideOverlay.pipe(take(1)).subscribe(hideOverlay => {
        expect(hideOverlay).toEqual(false)
      })

      const elementHasHiddenClass = sut.hoistFixture.debugElement.query(By.css('.flo-grid-list-overlay-hide'))
      expect(elementHasHiddenClass).toBeFalsy()
    })

    it('should respect enabled flag', () => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [FloGridTestingModule, FloGridListModule.config({
          overlay: {
            enabled: false
          }
        })]
      }).compileComponents()

      const sut = createSut()
      sut.instance.hideOverlay.toPromise().then(res => {
        expect(res).toEqual(true)
      })
      sut.instance.showOverlay.toPromise().then(res => {
        expect(res).toEqual(false)
      })
    })

    it('should be ignored on platform server', async(() => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [FloGridListModule],
        declarations: [FloGridTilesTestComponent],
        providers: [{
          provide: PLATFORM_ID,
          useValue: 'server'
        }]
      }).compileComponents()
      const sut = createSut()
      sut.instance.hideOverlay.pipe(take(1)).subscribe(res => {
        expect(res).toEqual(true)
      })
      sut.instance.showOverlay.pipe(take(1)).subscribe(res => {
        expect(res).toEqual(false)
      })
      const elementHasHiddenClass = sut.hoistFixture.debugElement.query(By.css('.flo-grid-list-overlay-hide'))
      expect(elementHasHiddenClass).toBeTruthy()
    }))
  })

  it('should setItemAtIndex', () => {
    const sut = createSut()
    sut.hoistInstance.setCount(2)
    sut.hoistInstance.setItems([{ id: '1', value: 'SOME_VALUE_1' }, { id: '2', value: 'SOME_VALUE_2' }])
    sut.instance.setItemAtIndex(0, { id: '1', value: 'WE WIN!' } as any)
    sut.hoistFixture.detectChanges()
    const res = sut.instance.gridItemContainers.toArray()
    expect(res[0].nativeElement.textContent).toEqual('WE WIN!')
    expect(res[1].nativeElement.textContent).toEqual('SOME_VALUE_2')
  })

  it('should set value of currently selected', () => {
    const sut = createSut()
    sut.hoistInstance.setCount(2)
    sut.hoistInstance.setSelectedIndex(1)
    sut.hoistInstance.setItems([{ id: '1', value: 'SOME_VALUE_1' }, { id: '2', value: 'SOME_VALUE_2' }])
    sut.instance.setValueOfSelected({ id: '1', value: 'WE_WIN!' })
    sut.hoistFixture.detectChanges()
    const res = sut.instance.gridItemContainers.toArray()
    expect(res[0].nativeElement.textContent).toEqual('SOME_VALUE_1')
    expect(res[1].nativeElement.textContent).toEqual('WE_WIN!')
  })

  describe('swap items function', () => {
    it('should swap items when all provided', () => {
      const sut = createSut()
      const item0 = { id: 1, test: 'Test1' }
      const item1 = { id: 2, test: 'Test2' }

      sut.instance.items = [item0, item1]
      sut.instance.setCount(2)
      sut.instance.swapItemsAtIndex(1, item0, 0)

      expect(sut.instance.items).toEqual([item1, item0])
    })

    it('should swap items when only to is provided', () => {
      const sut = createSut()
      const item0 = { id: 1, test: 'Test1' }
      const item1 = { id: 2, test: 'Test2' }

      sut.instance.items = [item0, item1]
      sut.instance.swapItemsAtIndex(0, item0)

      expect(sut.instance.items[0]).toEqual(item0)
    })
  })

  describe('allow selecting of next available empty item', () => {
    describe('when disabled', () => {
      it('should not work', () => {
        const sut = createSut()
        sut.hoistInstance.items = [{ id: 1 }]
        sut.instance.setCount(2)
        expect(sut.instance.selectedIndex).toEqual(0)
      })
    })
    describe('when enabled', () => {
      beforeEach(() => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({
          imports: [FloGridTestingModule, FloGridListModule.config({
            autoSelectNextEmptyOnCountChange: true
          })]
        }).compileComponents()
      })
      it('should handle counts of 1', () => {
        const sut = createSut()
        sut.hoistInstance.items = [{ id: 1 }]
        sut.instance.setCount(1)
        expect(sut.instance.selectedIndex).toEqual(0)
      })
      it('should handle counts of 2', () => {
        const sut = createSut()
        sut.hoistInstance.items = [{ id: 1 }]
        sut.instance.setCount(2)
        expect(sut.instance.selectedIndex).toEqual(1)
      })
      it('should handle counts of 3', () => {
        const sut = createSut()
        sut.hoistInstance.items = [{ id: 1 }]
        sut.instance.setCount(3)
        expect(sut.instance.selectedIndex).toEqual(1)
      })
      it('should handle counts of 4', () => {
        const sut = createSut()
        sut.hoistInstance.items = [{ id: 1 }]
        sut.instance.setCount(4)
        expect(sut.instance.selectedIndex).toEqual(1)
      })

      it('should handle multi items w/ counts', () => {
        const sut = createSut()
        sut.hoistInstance.items = [{ id: 1 }, { id: 2 }]
        sut.instance.setCount(4)
        expect(sut.instance.selectedIndex).toEqual(2)
      })
    })
  })

  describe('isIdSelected', () => {
    it('works internally', () => {
      const sut = createSut()
      sut.hoistInstance.items = [{ id: '1', prop: 'prop1' }, { id: '2', prop: 'prop1' }]
      sut.instance.setCount(2)
      sut.instance.setSelectedIndex(0)
      expect(sut.instance.isIdSelected('1')).toEqual(true)
    })

    it('via click event', () => {
      const sut = createSut()
      sut.hoistInstance.items = [{ id: '1', prop: 'prop1' }, { id: '2', prop: 'prop1' }]
      sut.instance.setCount(2)
      const res = sut.instance.gridItemContainers.toArray()
      res[0].nativeElement.click()
      expect(sut.instance.isIdSelected('1')).toEqual(true)
    })
  })

  describe('isIdSelected', () => {
    it('works internally', () => {
      const sut = createSut()
      sut.hoistInstance.items = [{ id: '1', prop: 'prop1' }, { id: '2', prop: 'prop1' }]
      sut.instance.setCount(2)
      sut.instance.setSelectedIndex(0)
      expect(sut.instance.isItemSelected({ id: '1', prop: 'prop1' })).toEqual(true)
    })

    it('via click event', () => {
      const sut = createSut()
      sut.hoistInstance.items = [{ id: '1', prop: 'prop1' }, { id: '2', prop: 'prop1' }]
      sut.instance.setCount(2)
      const res = sut.instance.gridItemContainers.toArray()
      res[0].nativeElement.click()
      expect(sut.instance.isItemSelected({ id: '1', prop: 'prop1' })).toEqual(true)
    })
  })

  describe('resetItems', () => {
    it('should reset', () => {
      const sut = createSut()
      sut.hoistInstance.items = [{ id: '1', prop: 'prop1' }, { id: '2', prop: 'prop1' }]
      sut.instance.setCount(4)
      sut.instance.resetItems()
      expect(sut.instance.items.length).toEqual(0)
      expect(sut.instance.count).toEqual(4)
    })
  })

  describe('isCount', () => {
    it('should return true w/ matching count', () => {
      const sut = createSut()
      sut.hoistInstance.items = [{ id: '1', prop: 'prop1' }, { id: '2', prop: 'prop1' }]
      sut.instance.setCount(4)
      expect(sut.instance.isCount(4)).toEqual(true)
    })
    it('should return false w/ mismatching count', () => {
      const sut = createSut()
      sut.hoistInstance.items = [{ id: '1', prop: 'prop1' }, { id: '2', prop: 'prop1' }]
      sut.instance.setCount(2)
      expect(sut.instance.isCount(4)).toEqual(false)
    })
  })

  describe('canSelectItem', () => {
    const item1 = { id: '1', prop: 'prop1' }
    const item2 = { id: '2', prop: 'prop2' }
    const items = [item1, item2]
    it('should allow selecting when in view', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = items
      expect(sut.instance.canSelectItem(item2)).toEqual(true)
    })

    it('should not allow selecting when in view but is already selected', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = items
      sut.instance.setItem(item1)
      expect(sut.instance.canSelectItem(item1)).toEqual(false)
    })
  })

  describe('removeItem', () => {
    const item1 = { id: '1', prop: 'prop1' }
    const item2 = { id: '2', prop: 'prop2' }
    const items = [item1, item2]

    it('should remove when in collection', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = items
      sut.instance.removeItem(item2)
      expect(sut.hoistInstance.items.length).toEqual(2)
      expect(sut.hoistInstance.items[0]).toEqual(item1)
      expect(sut.hoistInstance.items[1]).toBeUndefined()
    })

    it('should ignore when not in collection', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = items
      sut.instance.removeItem({ id: 'somerandomid' })
      expect(sut.hoistInstance.items.length).toEqual(2)
      expect(sut.hoistInstance.items[0]).toEqual(item1)
      expect(sut.hoistInstance.items[1]).toEqual(item2)
    })
  })

  describe('isItemNotInGrid', () => {
    const item1 = { id: '1', prop: 'prop1' }
    const item2 = { id: '2', prop: 'prop2' }
    const items = [item1]
    it('should return true when item is not inside grid', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = items
      expect(sut.instance.isItemNotInGrid(item2)).toEqual(true)
    })
  })

  describe('isIdNotSelected', () => {
    const item1 = { id: '1', prop: 'prop1' }
    it('should return true when an id is not selected', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = [item1]
      sut.instance.setSelectedId('1')
      expect(sut.instance.isIdNotSelected('2')).toEqual(true)
    })
  })

  describe('isItemInAnotherIndex', () => {
    const item1 = { id: '1', prop: 'prop1' }
    const item2 = { id: '2', prop: 'prop2' }
    it('should return true when item is in another index', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = [item1, item2]
      expect(sut.instance.isItemInAnotherIndex(item2, 0)).toEqual(true)
    })

    it('should return false when item is not in another index ', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = [item1]
      expect(sut.instance.isItemInAnotherIndex(item2, 0)).toEqual(false)
    })
  })
})
