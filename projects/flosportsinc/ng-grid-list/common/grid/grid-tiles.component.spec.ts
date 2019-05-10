import { async, TestBed } from '@angular/core/testing'
import { FloGridTilesComponent } from './grid-tiles.component'
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
  selector: 'flo-grid-tiles-test-component',
  template: `
    <flo-grid-tiles [(count)]="count" [items]="items">
      <div *floGridListOverlay>
        Overlay controls go here
      </div>
      <div *floGridListItemSome="let item">{{ item.value }}</div>
      <div *floGridListItemNone>EMPTY</div>
    </flo-grid-tiles>
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
  const fixture = hoistFixture.debugElement.query(By.directive(FloGridTilesComponent))
  hoistFixture.detectChanges()
  return {
    hoistFixture,
    hoistInstance: fixture.componentInstance,
    fixture,
    instance: fixture.componentInstance as FloGridTilesComponent<any>
  }
}

const testInputProperty = (prop: string, testNumber: any, ) => {
  const sut = TestBed.createComponent(FloGridTilesComponent)
  sut.componentInstance[prop] = testNumber
  sut.detectChanges()
  expect(sut.componentInstance[prop]).toEqual(testNumber)
  sut.componentInstance[`${prop}Change`].toPromise().then((ve: number) => expect(ve).toEqual(testNumber))
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

describe(FloGridTilesComponent.name, () => {
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
      const sut = TestBed.createComponent(FloGridTilesComponent)
      const testNumber = 0

      sut.componentInstance.setCount(testNumber)
      sut.detectChanges()
      expect(sut.componentInstance.count).toEqual(DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT)
      sut.componentInstance.countChange.toPromise().then(ve => expect(ve).toEqual(DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT))
    })

    it('should handle out of bounds when value is set above maximum', () => {
      const sut = TestBed.createComponent(FloGridTilesComponent)
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

  it('should set value at index', () => {
    const sut = createSut()
    sut.hoistInstance.setCount(2)
    sut.hoistInstance.setItems([{ id: '1', value: 'SOME_VALUE_1' }, { id: '2', value: 'SOME_VALUE_2' }])
    sut.instance.setValueAtIndex(0, { id: '1', value: 'WE WIN!' } as any)
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
})
