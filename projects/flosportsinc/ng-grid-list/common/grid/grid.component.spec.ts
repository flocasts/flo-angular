import { async, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing'
import { FloGridListViewComponent } from './grid.component'
import { FloGridListModule } from '../ng-grid-list.module'
import { take } from 'rxjs/operators'
import { PLATFORM_ID, Component, NgModule } from '@angular/core'
import { By } from '@angular/platform-browser'
import {
  FLO_GRID_LIST_MIN_COUNT, FLO_GRID_LIST_MAX_COUNT, FLO_GRID_LIST_OVERLAY_ENABLED,
  FLO_GRID_LIST_OVERLAY_START, FLO_GRID_LIST_OVERLAY_FADEOUT, FLO_GRID_LIST_OVERLAY_THROTTLE,
  FLO_GRID_LIST_MAX_HEIGHT, FLO_GRID_LIST_SELECTED_INDEX, FLO_GRID_LIST_OVERLAY_STATIC,
  FLO_GRID_LIST_ITEMS, FLO_GRID_LIST_DRAG_DROP_ENABLED, FLO_GRID_LIST_ASPECT_RATIO,
  FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT, FLO_GRID_LIST_TRACK_BY_FN,
  FLO_GRID_LIST_CONTAINER_ID_PREFIX, FLO_GRID_LIST_FILL_TO_FIT,
  FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD, FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST,
  FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED, FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY,
  FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR
} from '../ng-grid-list.tokens'
import {
  DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT,
  DEFAULT_FLO_GRID_LIST_ASPECT_RATIO,
  DEFAULT_FLO_GRID_LIST_CONTAINER_ID_PREFIX,
  DEFAULT_FLO_GRID_LIST_FILL_TO_FIT,
  DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD,
  DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT,
  DEFAULT_FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY,
  DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT
} from '../ng-grid-list.module.defaults'

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
      <div *floGridListItemSome="let item" class="some" [attr.id]="'t_' + item.value.id">{{ item.value.value }}</div>
      <div *floGridListItemNone class="none">EMPTY</div>
      <div *floGridListItemSomeDrag>EMPTY DRAG OVERLAY</div>
      <div *floGridListItemNoneDrag>SOME DRAG OVERLAY</div>
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

const SAMPLE_ITEM_1 = { id: '1', prop: 'prop1' }
const SAMPLE_ITEM_2 = { id: '2', prop: 'prop2' }
const SAMPLE_ITEM_3 = { id: '3', prop: 'prop3' }
const SAMPLE_ITEM_4 = { id: '4', prop: 'prop4' }

const createSut = (detectChanges = true) => {
  const hoistFixture = TestBed.createComponent(FloGridTilesTestComponent)
  const fixture = hoistFixture.debugElement.query(By.directive(FloGridListViewComponent))
  if (detectChanges) { hoistFixture.detectChanges() }
  return {
    hoistFixture,
    hoistInstance: fixture.componentInstance,
    fixture,
    instance: fixture.componentInstance as FloGridListViewComponent<any>
  }
}

export const testInputProperty = (prop: string, testValue: any, component: any = FloGridListViewComponent) => {
  const sut = TestBed.createComponent(component) as any
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

  return {
    collection: sut.instance.gridItemContainers.toArray(),
    sut
  }
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
      const testNumber = DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT + 1

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
    it('should enforce', () => {
      const sut = TestBed.createComponent(FloGridListViewComponent)
      expect(sut.componentInstance.count).toEqual(1)
      sut.componentInstance.setMin(2)
      sut.detectChanges()
      expect(sut.componentInstance.count).toEqual(2)
    })
  })

  describe('max property', () => {
    it('should double bind', () => testInputProperty('max', 52))
    it('should expose setter function', () => testInputPropSetFunc('max', 'setMax', 52))
    it('should start with token value', () => expect(createSut().instance.max).toEqual(TestBed.get(FLO_GRID_LIST_MAX_COUNT)))
    it('should enforce', () => {
      const sut = TestBed.createComponent(FloGridListViewComponent)
      expect(sut.componentInstance.count).toEqual(1)
      sut.componentInstance.setCount(14)
      sut.detectChanges()
      expect(sut.componentInstance.count).toEqual(14)
      sut.componentInstance.setMax(5)
      sut.detectChanges()
      expect(sut.componentInstance.count).toEqual(5)
    })
  })

  describe('maxheight property', () => {
    it('should double bind', () => testInputProperty('maxheight', 400))
    it('should expose setter function', () => testInputPropSetFunc('maxheight', 'setMaxheight', 400))
    it('should start with token value', () => expect(createSut().instance.maxheight).toEqual(TestBed.get(FLO_GRID_LIST_MAX_HEIGHT)))
  })

  describe('containerIdPrefix property', () => {
    it('should double bind', () => testInputProperty('containerIdPrefix', '_cool_prefx_yo_'))
    it('should expose setter function', () => testInputPropSetFunc('containerIdPrefix', 'setContainerIdPrefix', '_cool_prefx_yo_'))
    it('should start with token value', () =>
      expect(createSut().instance.containerIdPrefix).toEqual(TestBed.get(FLO_GRID_LIST_CONTAINER_ID_PREFIX)))
    it('should start with default token value', () =>
      expect(createSut().instance.containerIdPrefix).toEqual(DEFAULT_FLO_GRID_LIST_CONTAINER_ID_PREFIX))

    it('should separate container IDs and content IDs', () => {
      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1]
      sut.hoistFixture.detectChanges()

      const prefixedIds = sut.fixture.queryAll(By.css('#__fs_grid__1'))
      const innerIds = sut.fixture.queryAll(By.css('#t_1'))

      expect(prefixedIds.length).toEqual(1)
      expect(innerIds.length).toEqual(1)
    })

    it('should configure via module', () => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [FloGridTestingModule, FloGridListModule.config({
          overlay: {
            throttle: 6000,
            fadeout: 1
          },
          containerIdPrefix: '-test_prefix_config-'
        })]
      }).compileComponents()

      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1]
      sut.hoistFixture.detectChanges()

      const prefixedIds = sut.fixture.queryAll(By.css('#-test_prefix_config-1'))
      const innerIds = sut.fixture.queryAll(By.css('#t_1'))

      expect(prefixedIds.length).toEqual(1)
      expect(innerIds.length).toEqual(1)
    })
  })

  describe('fillToFit property', () => {
    it('should double bind', () => testInputProperty('fillToFit', false))
    it('should expose setter function', () => testInputPropSetFunc('fillToFit', 'setFillToFit', false))
    it('should start with token value', () =>
      expect(createSut().instance.fillToFit).toEqual(TestBed.get(FLO_GRID_LIST_FILL_TO_FIT)))
    it('should start with default token value', () =>
      expect(createSut().instance.fillToFit).toEqual(DEFAULT_FLO_GRID_LIST_FILL_TO_FIT))

    it('should configure via module', () => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [FloGridTestingModule, FloGridListModule.config({
          overlay: {
            throttle: 6000,
            fadeout: 1
          },
          fillToFit: true
        })]
      }).compileComponents()

      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1]
      sut.hoistFixture.detectChanges()

      const elms = sut.fixture.queryAll(By.css('.fill-to-fit'))

      expect(elms.length).toEqual(1)
    })

    it('should configure via module', () => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [FloGridTestingModule, FloGridListModule.config({
          overlay: {
            throttle: 6000,
            fadeout: 1
          },
          fillToFit: false
        })]
      }).compileComponents()

      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1]
      sut.hoistFixture.detectChanges()

      const elms = sut.fixture.queryAll(By.css('.fill-to-fit'))

      expect(elms.length).toEqual(0)
    })
  })

  describe('trackByFn property', () => {
    it('should double bind', () => testInputProperty('trackByFn', () => true))
    it('should expose setter function', () => testInputPropSetFunc('trackByFn', 'setTrackByFn', (idx: number) => idx + 1))
    it('should start with token value', () =>
      expect(createSut().instance.trackByFn(0, undefined as any)).toEqual(TestBed.get(FLO_GRID_LIST_TRACK_BY_FN)(0, undefined)))

    it('should handle undefined', () => {
      const sample = undefined
      const sut = TestBed.get(FLO_GRID_LIST_TRACK_BY_FN)(0, sample)
      expect(sut).toEqual(undefined)
    })
    it('should handle empty object', () => {
      const sample = {}
      const sut = TestBed.get(FLO_GRID_LIST_TRACK_BY_FN)(0, sample)
      expect(sut).toEqual(undefined)
    })
    it('should handle empty value', () => {
      const sample = { value: undefined }
      const sut = TestBed.get(FLO_GRID_LIST_TRACK_BY_FN)(0, sample)
      expect(sut).toEqual(undefined)
    })
    it('should undefined value.id', () => {
      const sample = { value: { id: undefined } }
      const sut = TestBed.get(FLO_GRID_LIST_TRACK_BY_FN)(0, sample)
      expect(sut).toEqual(undefined)
    })
    it('should return value.id', () => {
      const sample = { value: { id: '123' } }
      const sut = TestBed.get(FLO_GRID_LIST_TRACK_BY_FN)(0, sample)
      expect(sut).toEqual('123')
    })
  })

  describe('selectedId property', () => {
    it('should double bind', () => testInputProperty('selectedId', 'awesome-id'))
    it('should expose setter function', () => testInputPropSetFunc('selectedId', 'setSelectedId', 'awesome-id'))
  })

  describe('fullscreen', () => {
    it('no', () => {
      const sut = createSut()
      if (window.outerHeight - window.innerHeight <= 1) {
        expect(sut.instance.isFullscreen()).toEqual(true)
      } else {
        expect(sut.instance.isFullscreen()).toEqual(false)
      }
    })
  })

  describe('aspectRatio property', () => {
    it('should double bind', () => testInputProperty('aspectRatio', 0.5625))
    it('should expose setter function', () => testInputPropSetFunc('aspectRatio', 'setAspectRatio', 0.5625))
    it('should previous value if not of type number', () => {
      const sut = createSut().instance
      sut.setAspectRatio('fasdfasdfasdf' as any)
      expect(sut.aspectRatio).toEqual(TestBed.get(FLO_GRID_LIST_ASPECT_RATIO))
    })

    it('should get default', () => {
      const sut = createSut().instance
      expect(TestBed.get(FLO_GRID_LIST_ASPECT_RATIO)).toEqual(DEFAULT_FLO_GRID_LIST_ASPECT_RATIO)
    })

    it('should run change detection on fullscreen change', () => {
      const sut = createSut()
      const event = new Event('fullscreenchange', { bubbles: true })
      const spy = spyOn(sut.instance, 'fullscreenchange').and.callThrough()
      sut.fixture.nativeElement.dispatchEvent(event)
      expect(spy).toHaveBeenCalled()
    })

    // it('should run native if fullscreen', () => {
    //   const sut = createSut()
    //   const spy = spyOn(sut.instance, 'isFullscreen').and.returnValue(true)
    //   const spy2 = spyOn(sut.instance, 'getNativeAspectRatio').and.callThrough()
    //   const ar = sut.instance.aspectRatioPercentage()
    //   expect(spy).toHaveBeenCalled()
    //   expect(spy2).toHaveBeenCalled()
    //   expect(ar).toEqual(sut.instance.getNativeAspectRatio())
    // })
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

  describe('dragDropHoverBgEnabled property', () => {
    it('should double bind', () => testInputProperty('dragDropHoverBgEnabled', false))
    it('should expose setter function', () => testInputPropSetFunc('dragDropHoverBgEnabled', 'setDragDropHoverBgEnabled', false))
    it('should start with token value', () =>
      expect(createSut().instance.dragDropHoverBgEnabled).toEqual(TestBed.get(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED)))
    it('should start with default token value', () =>
      expect(TestBed.get(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED)).toEqual(DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED))

    describe('when enabled', () => {
      beforeEach(() => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({
          imports: [FloGridListModule.config({ dragDrop: { dragOverBgEnabled: true } })],
          declarations: [FloGridTilesTestComponent]
        }).compileComponents()
      })

      it('should set correct DI value', () => {
        expect(TestBed.get(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED)).toEqual(true)
      })
    })

    describe('when disabled', () => {
      beforeEach(() => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({
          imports: [FloGridListModule.config({ dragDrop: { dragOverBgEnabled: false } })],
          declarations: [FloGridTilesTestComponent]
        }).compileComponents()
      })
      it('should set correct DI value', () => {
        expect(TestBed.get(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED)).toEqual(false)
      })
    })
  })

  describe('dragDropHoverBgColor property', () => {
    it('should double bind', () => testInputProperty('dragDropHoverBgColor', '#000'))
    it('should expose setter function', () => testInputPropSetFunc('dragDropHoverBgColor', 'setDragDropHoverBgColor', '#000'))
    it('should start with token value', () =>
      expect(createSut().instance.dragDropHoverBgColor).toEqual(TestBed.get(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR)))

    it('should start with default token value', () =>
      expect(TestBed.get(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR)).toEqual(DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR))

    describe('when configured', () => {
      beforeEach(() => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({
          imports: [FloGridListModule.config({ dragDrop: { dragOverBgColor: '#000' } })],
          declarations: [FloGridTilesTestComponent]
        }).compileComponents()
      })
      it('should set correct DI value', () => {
        expect(TestBed.get(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR)).toEqual('#000')
      })
    })
  })

  describe('dragDropHoverBgOpacity property', () => {
    it('should double bind', () => testInputProperty('dragDropHoverBgOpacity', 0.2))
    it('should expose setter function', () => testInputPropSetFunc('dragDropHoverBgOpacity', 'setDragDropHoverBgOpacity', 0.2))
    it('should start with token value', () =>
      expect(createSut().instance.dragDropHoverBgOpacity).toEqual(TestBed.get(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY)))
    it('should start with default token value', () =>
      expect(TestBed.get(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY)).toEqual(DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY))

    describe('when configured', () => {
      beforeEach(() => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({
          imports: [FloGridListModule.config({ dragDrop: { dragOverBgOpacity: 0.25 } })],
          declarations: [FloGridTilesTestComponent]
        }).compileComponents()
      })
      it('should set correct DI value', () => {
        expect(TestBed.get(FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY)).toEqual(0.25)
      })
    })
  })

  describe('selectFromLowerIndicesFirst property', () => {
    it('should double bind', () => testInputProperty('selectFromLowerIndicesFirst', true))
    it('should expose setter function', () =>
      testInputPropSetFunc('selectFromLowerIndicesFirst', 'setSelectFromLowerIndicesFirst', true))
    it('should start with token value', () =>
      expect(createSut().instance.selectFromLowerIndicesFirst).toEqual(TestBed.get(FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST)))
    it('should start with default token value', () =>
      expect(TestBed.get(FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST)).toEqual(DEFAULT_FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST))

    describe('when enabled', () => {
      beforeEach(() => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({
          imports: [FloGridListModule.config({ selectFromLowerIndicesFirst: true })],
          declarations: [FloGridTilesTestComponent]
        }).compileComponents()
      })
      it('...', () => {
        expect(createSut().instance.selectFromLowerIndicesFirst).toEqual(true)
      })
    })
  })

  describe('selectNextEmptyOnCount property', () => {
    it('should double bind', () => testInputProperty('selectNextEmptyOnCount', true))
    it('should expose setter function', () =>
      testInputPropSetFunc('selectNextEmptyOnCount', 'setSelectNextEmptyOnCount', true))
    it('should start with token value', () =>
      expect(createSut().instance.selectNextEmptyOnCount).toEqual(TestBed.get(FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT)))
    it('should start with default token value', () =>
      expect(TestBed.get(FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT)).toEqual(DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT))
  })

  describe('selectNextEmptyOnAdd property', () => {
    it('should double bind', () => testInputProperty('selectNextEmptyOnAdd', true))
    it('should expose setter function', () =>
      testInputPropSetFunc('selectNextEmptyOnAdd', 'setSelectNextEmptyOnAdd', true))
    it('should start with token value', () =>
      expect(createSut().instance.selectNextEmptyOnAdd).toEqual(TestBed.get(FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD)))
    it('should start with default token value', () =>
      expect(TestBed.get(FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD)).toEqual(DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD))

    describe('should select next empty when enabled', () => {
      beforeEach(() => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({
          imports: [FloGridListModule.config({ selectNextEmptyOnAdd: true })],
          declarations: [FloGridTilesTestComponent]
        }).compileComponents()
      })

      it('configure from NgModule', () => {
        expect(TestBed.get(FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD)).toEqual(true)
      })

      it('basic case', () => {
        const sut = createSut()
        sut.instance.setCount(4)
        sut.instance.setItems([SAMPLE_ITEM_1, SAMPLE_ITEM_2])
        sut.instance.setItem(SAMPLE_ITEM_3, 2)
        sut.hoistFixture.detectChanges()

        expect(sut.instance.selectedIndex).toBe(3)
        expect(sut.instance.items[2]).toEqual(SAMPLE_ITEM_3)
        expect(sut.instance.items[3]).toBeUndefined()
      })

      it('ignoring when no empty slots are available', () => {
        const sut = createSut()
        sut.instance.setCount(2)
        sut.instance.setItems([SAMPLE_ITEM_1, SAMPLE_ITEM_2, SAMPLE_ITEM_3])
        sut.instance.setItem(SAMPLE_ITEM_4, 2)
        sut.hoistFixture.detectChanges()

        expect(sut.instance.selectedIndex).toBe(0)
        expect(sut.instance.items[2]).toEqual(SAMPLE_ITEM_4)
      })
    })
  })

  describe('when count equals 1', () => {
    it('should show 1 empty', fakeAsync(() => {
      const result = setupCountSomeNoneTests(1, [])
      tick(0)
      result.sut.hoistFixture.detectChanges()
      expect(result.collection.length).toEqual(1)
      expect(result.collection[0].nativeElement.innerText).toEqual('EMPTY')
      discardPeriodicTasks()
    }))
    it('should show 1 filled', fakeAsync(() => {
      const result = setupCountSomeNoneTests(1, [{ id: '1', value: 'SOME_VALUE' }])
      tick(0)
      result.sut.hoistFixture.detectChanges()
      expect(result.collection.length).toEqual(1)
      expect(result.collection[0].nativeElement.innerText).toEqual('SOME_VALUE')
      discardPeriodicTasks()
    }))
  })

  describe('when count equals 2', () => {
    it('should show 2 empty', () => {
      const result = setupCountSomeNoneTests(2, [])
      expect(result.collection.length).toEqual(2)
      expect(result.collection[0].nativeElement.innerText).toEqual('EMPTY')
      expect(result.collection[1].nativeElement.innerText).toEqual('EMPTY')
    })
    it('should show 1 empty, 1 filled', () => {
      const result = setupCountSomeNoneTests(2, [undefined, { id: '1', value: 'SOME_VALUE' }])
      expect(result.collection.length).toEqual(2)
      expect(result.collection[0].nativeElement.innerText).toEqual('EMPTY')
      expect(result.collection[1].nativeElement.innerText).toEqual('SOME_VALUE')
    })
    it('should show 2 filled', () => {
      const result = setupCountSomeNoneTests(2, [{ id: '1', value: 'SOME_VALUE_1' }, { id: '2', value: 'SOME_VALUE_2' }])
      expect(result.collection.length).toEqual(2)
      expect(result.collection[0].nativeElement.innerText).toEqual('SOME_VALUE_1')
      expect(result.collection[1].nativeElement.innerText).toEqual('SOME_VALUE_2')
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

    it('should show when enabled on on platform server', async(() => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [FloGridListModule.config({
          overlay: { enabled: true }
        })],
        declarations: [FloGridTilesTestComponent],
        providers: [{
          provide: PLATFORM_ID,
          useValue: 'server'
        }]
      }).compileComponents()
      const sut = createSut()
      sut.instance.hideOverlay.pipe(take(1)).subscribe(res => {
        expect(res).toEqual(false)
      })
      sut.instance.showOverlay.pipe(take(1)).subscribe(res => {
        expect(res).toEqual(true)
      })
      const elementHasHiddenClass = sut.hoistFixture.debugElement.query(By.css('.fg.list-overlay-hide'))
      expect(elementHasHiddenClass).toBeFalsy()
    }))

    it('should hide when enabled on on platform server', async(() => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [FloGridListModule.config({ overlay: { enabled: false } })],
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
      const elementHasHiddenClass = sut.hoistFixture.debugElement.query(By.css('.list-overlay-hide'))
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

    it('should swap items with selected default param', () => {
      const sut = createSut()
      const item0 = { id: 1, test: 'Test1' }
      const item1 = { id: 2, test: 'Test2' }

      sut.instance.items = [item0, item1]
      sut.instance.setCount(2)
      sut.instance.setSelectedIndex(0)
      sut.instance.swapItems(item1)

      expect(sut.instance.items).toEqual([item1, item0])
    })
  })

  describe('canSwapItem', () => {
    it('should', () => {
      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
      sut.instance.setCount(2)
      expect(sut.instance.canSwapItem(SAMPLE_ITEM_1, 1)).toEqual(true)
    })

    it('should', () => {
      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
      sut.instance.setSelectedIndex(0)
      sut.instance.setCount(2)
      expect(sut.instance.canSwapItem(SAMPLE_ITEM_2)).toEqual(true)
    })
  })

  describe('allow selecting of next available empty item', () => {
    describe('when disabled', () => {
      it('should not work', () => {
        const sut = createSut()
        sut.hoistInstance.items = [SAMPLE_ITEM_1]
        sut.instance.setCount(2)
        expect(sut.instance.selectedIndex).toEqual(0)
      })
    })
    describe('when enabled', () => {
      beforeEach(() => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({
          imports: [FloGridTestingModule, FloGridListModule.config({
            selectNextEmptyOnCount: true
          })]
        }).compileComponents()
      })
      it('should handle counts of 1', () => {
        const sut = createSut()
        sut.hoistInstance.items = [SAMPLE_ITEM_1]
        sut.instance.setCount(1)
        sut.hoistFixture.detectChanges()
        expect(sut.instance.selectedIndex).toEqual(0)
      })
      it('should handle counts of 2', () => {
        const sut = createSut()
        sut.hoistInstance.items = [SAMPLE_ITEM_1]
        sut.instance.setCount(2)
        sut.hoistFixture.detectChanges()
        expect(sut.instance.selectedIndex).toEqual(1)
      })
      it('should handle counts of 3', () => {
        const sut = createSut()
        sut.hoistInstance.items = [SAMPLE_ITEM_1]
        sut.instance.setCount(3)
        sut.hoistFixture.detectChanges()
        expect(sut.instance.selectedIndex).toEqual(1)
      })
      it('should handle counts of 4', () => {
        const sut = createSut()
        sut.hoistInstance.items = [SAMPLE_ITEM_1]
        sut.instance.setCount(4)
        sut.hoistFixture.detectChanges()
        expect(sut.instance.selectedIndex).toEqual(1)
      })
      it('should handle multi items w/ counts', () => {
        const sut = createSut()
        sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
        sut.instance.setCount(4)
        sut.hoistFixture.detectChanges()
        expect(sut.instance.selectedIndex).toEqual(2)
      })
    })
  })

  describe('isIdSelected', () => {
    it('works internally', () => {
      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
      sut.instance.setCount(2)
      sut.instance.setSelectedIndex(0)
      expect(sut.instance.isIdSelected('1')).toEqual(true)
    })

    it('via click event', () => {
      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
      sut.instance.setCount(2)
      sut.hoistFixture.detectChanges()
      const res = sut.instance.gridItemContainers.toArray()
      res[0].nativeElement.click()
      expect(sut.instance.isIdSelected(SAMPLE_ITEM_1.id)).toEqual(true)
    })
  })

  describe('isIdSelected', () => {
    it('works internally', () => {
      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
      sut.instance.setCount(2)
      sut.instance.setSelectedIndex(0)
      expect(sut.instance.isItemSelected(SAMPLE_ITEM_1)).toEqual(true)
    })
  })

  describe('resetItems', () => {
    it('should reset', () => {
      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
      sut.instance.setCount(4)
      sut.instance.resetItems()
      expect(sut.instance.items.length).toEqual(0)
      expect(sut.instance.count).toEqual(4)
    })
  })

  describe('isCount', () => {
    it('should return true w/ matching count', () => {
      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
      sut.instance.setCount(4)
      expect(sut.instance.isCount(4)).toEqual(true)
    })
    it('should return false w/ mismatching count', () => {
      const sut = createSut()
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
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

  describe('canReplaceItem', () => {
    it('should using defaul', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
      expect(sut.instance.canReplaceItem(SAMPLE_ITEM_2, 1)).toEqual(true)
    })
  })

  describe('removeItem', () => {
    const items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]

    it('should remove when in collection', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = items
      sut.instance.removeItem(SAMPLE_ITEM_2)
      expect(sut.hoistInstance.items.length).toEqual(2)
      expect(sut.hoistInstance.items[0]).toEqual(SAMPLE_ITEM_1)
      expect(sut.hoistInstance.items[1]).toBeUndefined()
    })

    it('should ignore when not in collection', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = items
      sut.instance.removeItem({ id: 'somerandomid' })
      expect(sut.hoistInstance.items.length).toEqual(2)
      expect(sut.hoistInstance.items[0]).toEqual(SAMPLE_ITEM_1)
      expect(sut.hoistInstance.items[1]).toEqual(SAMPLE_ITEM_2)
    })
  })

  describe('isItemNotInGrid', () => {
    const items = [SAMPLE_ITEM_1]
    it('should return true when item is not inside grid', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = items
      expect(sut.instance.isItemNotInGrid(SAMPLE_ITEM_2)).toEqual(true)
    })
  })

  describe('isIdNotSelected', () => {
    it('should return true when an id is not selected', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = [SAMPLE_ITEM_1]
      sut.instance.setSelectedId('1')
      expect(sut.instance.isIdNotSelected('2')).toEqual(true)
    })
  })

  describe('replaceItem', () => {
    it('should default to selected index', () => {
      const sut = createSut()
      sut.instance.setCount(4)
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2, SAMPLE_ITEM_3]
      sut.instance.setSelectedIndex(1)
      sut.instance.replaceItem(SAMPLE_ITEM_3)
      expect(sut.hoistInstance.items).toEqual([SAMPLE_ITEM_1, SAMPLE_ITEM_3, undefined])
    })
    it('should work', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
      sut.instance.replaceItem(SAMPLE_ITEM_2, 0)
      expect(sut.hoistInstance.items).toEqual([SAMPLE_ITEM_2, undefined])
    })
  })

  describe('findNextEmptyIndex', () => {
    it('should return next index when in viewcount', fakeAsync(() => {
      const sut = createSut()
      sut.instance.setCount(4)
      sut.hoistInstance.items = [SAMPLE_ITEM_1]
      tick(0)
      expect(sut.instance.findNextEmptyIndex().valueOrUndefined()).toEqual(1)
      discardPeriodicTasks()
    }))

    it('should return undefined when no index is next', fakeAsync(() => {
      const sut = createSut()
      sut.instance.setCount(1)
      sut.hoistInstance.items = [SAMPLE_ITEM_1]
      tick(0)
      expect(sut.instance.findNextEmptyIndex().valueOrUndefined()).toBeUndefined()
      discardPeriodicTasks()
    }))

    it('should return undefined when out of bounds', fakeAsync(() => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
      tick(0)
      expect(sut.instance.findNextEmptyIndex().valueOrUndefined()).toBeUndefined()
      discardPeriodicTasks()
    }))
  })

  describe('fillNextEmpty', () => {
    it('should fill an empty', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = []
      sut.instance.fillNextEmpty(SAMPLE_ITEM_1)
      expect(sut.hoistInstance.items[0]).toEqual(SAMPLE_ITEM_1)
    })

    it('should fill first empty', fakeAsync(() => {
      const sut = createSut()
      sut.instance.setCount(4)
      sut.hoistInstance.items = [SAMPLE_ITEM_1]
      sut.instance.fillNextEmpty(SAMPLE_ITEM_2)
      tick(0)
      sut.hoistFixture.detectChanges()
      expect(sut.hoistInstance.items[1]).toEqual(SAMPLE_ITEM_2)
      discardPeriodicTasks()
    }))
  })

  describe('isItemInAnotherIndex', () => {
    it('should return true when item is in another index', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2]
      expect(sut.instance.isItemInAnotherIndex(SAMPLE_ITEM_2, 0)).toEqual(true)
    })

    it('should return false when item is not in another index ', () => {
      const sut = createSut()
      sut.instance.setCount(2)
      sut.hoistInstance.items = [SAMPLE_ITEM_1]
      expect(sut.instance.isItemInAnotherIndex(SAMPLE_ITEM_2, 0)).toEqual(false)
    })
  })

  describe('selectedElementChange', () => {
    it('should output inner HTML element - some', done => {
      const sut = createSut()
      sut.instance.selectedElementChange.subscribe(res => {
        expect(res instanceof HTMLElement).toEqual(true)
        expect(res.classList.contains('some')).toEqual(true)
        done()
      })
      sut.instance.setCount(2)
      sut.hoistInstance.items = [SAMPLE_ITEM_1, SAMPLE_ITEM_2, undefined]
      sut.instance.setSelectedIndex(1)
      sut.hoistFixture.detectChanges()
    })
    it('should output inner HTML element - none', done => {
      const sut = createSut()
      sut.instance.selectedElementChange.subscribe(res => {
        expect(res instanceof HTMLElement).toEqual(true)
        expect(res.classList.contains('none')).toEqual(true)
        done()
      })
      sut.instance.setCount(2)
      sut.hoistInstance.items = [undefined, undefined]
      sut.instance.setSelectedIndex(1)
      sut.hoistFixture.detectChanges()
    })
  })

  describe('viewcount', () => {
    it('TODO', () => {
      const sut = createSut()
      sut.hoistInstance.count = 4
      sut.hoistFixture.detectChanges()
    })
  })
})
