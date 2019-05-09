import { async, TestBed, fakeAsync } from '@angular/core/testing'
import { FloGridTilesComponent } from './grid-tiles.component'
import { FloGridListModule } from '../ng-grid-list.module'
import { DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT } from '../ng-grid-list.module.defaults'
import { take } from 'rxjs/operators'
import { PLATFORM_ID, Component, NgModule } from '@angular/core'
import { By } from '@angular/platform-browser'
import {
  FLO_GRID_LIST_MIN_VIEWCOUNT, FLO_GRID_LIST_MAX_VIEWCOUNT, FLO_GRID_LIST_OVERLAY_ENABLED,
  FLO_GRID_LIST_OVERLAY_START, FLO_GRID_LIST_OVERLAY_FADEOUT, FLO_GRID_LIST_OVERLAY_THROTTLE,
  FLO_GRID_LIST_MAX_HEIGHT, FLO_GRID_LIST_SELECTED_INDEX
} from '../ng-grid-list.tokens'

@Component({
  selector: 'flo-grid-tiles-test-component',
  template: `
    <flo-grid-tiles [(count)]="count">
      <div *floGridListOverlay>
        Overlay controls go here
      </div>
      <div *floGridListItemSome="let item">
        <span>{{ item.title }}</span>
      </div>
      <div *floGridListItemNone>EMPTY</div>
    </flo-grid-tiles>
  `
})
export class FloGridTilesTestComponent {
  // tslint:disable: readonly-keyword
  count = 1
}

@NgModule({
  imports: [FloGridListModule],
  declarations: [FloGridTilesTestComponent]
})
export class FloGridTestingModule { }

// tslint:disable: no-object-mutation
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
    it('should start with token value', () => expect(createSut().instance.min).toEqual(TestBed.get(FLO_GRID_LIST_MIN_VIEWCOUNT)))
  })

  describe('max property', () => {
    it('should double bind', () => testInputProperty('max', 52))
    it('should expose setter function', () => testInputPropSetFunc('max', 'setMax', 52))
    it('should start with token value', () => expect(createSut().instance.max).toEqual(TestBed.get(FLO_GRID_LIST_MAX_VIEWCOUNT)))
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

  describe('chunk utility function', () => {
    it('should work', () => {
      const sut = createSut()
      const result = sut.instance.chunk(1, [{}, {}, {}, {}])
      expect(result.length).toEqual(4)
    })

    it('should handle empty collection', () => {
      const sut = createSut()
      const result = sut.instance.chunk(2, [{}, {}, {}])
      expect(result.length).toEqual(2)
    })

    it('should handle empty collection', () => {
      const sut = createSut()
      const result = sut.instance.chunk(1)
      expect(result.length).toEqual(0)
    })
  })

  describe('when count equals 1', () => {
    it('should', () => {
      const sut = createSut()
      const result = sut.hoistInstance.count = 1
      sut.hoistFixture.detectChanges()
      // TODO!
    })
  })

  describe('when count equals 2', () => {
    it('should', () => {
      const sut = createSut()
      const result = sut.hoistInstance.count = 2
      sut.hoistFixture.detectChanges()
      // TODO!
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

    it('should respect enabled flag', async(() => {
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
    }))

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
})
