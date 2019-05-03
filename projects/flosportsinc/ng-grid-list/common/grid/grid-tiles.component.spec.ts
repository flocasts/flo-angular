import { async, TestBed } from '@angular/core/testing'
import { FloGridTilesComponent } from './grid-tiles.component'
import { Component } from '@angular/core'
import { FloGridListModule } from '../ng-grid-list.module'
import { FLO_GRID_LIST_MIN_VIEWCOUNT, FLO_GRID_LIST_MAX_VIEWCOUNT, FLO_GRID_LIST_OVERLAY_ENABLED, FLO_GRID_LIST_OVERLAY_START, FLO_GRID_LIST_OVERLAY_FADEOUT, FLO_GRID_LIST_OVERLAY_THROTTLE } from '../ng-grid-list.tokens'
import { DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT } from '../ng-grid-list.module.defaults'

// @Component({
//   selector: 'flo-grid-tiles-test-component',
//   template: `
//     <flo-grid-tiles [(viewcount)]="viewcount"></flo-grid-tiles>
//   `
// })
// export class FloGridTilesTestComponent {
//   readonly viewcount = 12
// }

// tslint:disable: no-object-mutation

const createSut = () => {
  const fixture = TestBed.createComponent(FloGridTilesComponent)
  fixture.detectChanges()
  return fixture
}

const createSutInstance = () => createSut().componentInstance

const testInputProperty = (prop: string, testNumber: any, ) => {
  const sut = TestBed.createComponent(FloGridTilesComponent)
  sut.componentInstance[prop] = testNumber
  sut.detectChanges()
  expect(sut.componentInstance[prop]).toEqual(testNumber)
  sut.componentInstance[`${prop}Change`].toPromise().then((ve: number) => expect(ve).toEqual(testNumber))
}

const testInputPropSetFunc = (prop: string, prop2: string, num: any) => {
  const sut = createSutInstance()
  sut[prop2](num)
  expect(sut[prop]).toEqual(num)
  sut[`${prop}Change`].toPromise().then((ve: number) => expect(ve).toEqual(num))
}

describe(FloGridTilesComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloGridListModule]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(createSut().componentInstance).toBeTruthy()
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
    it('should start with token value', () => expect(createSutInstance().min).toEqual(TestBed.get(FLO_GRID_LIST_MIN_VIEWCOUNT)))
  })

  describe('max property', () => {
    it('should double bind', () => testInputProperty('max', 52))
    it('should expose setter function', () => testInputPropSetFunc('max', 'setMax', 52))
    it('should start with token value', () => expect(createSutInstance().max).toEqual(TestBed.get(FLO_GRID_LIST_MAX_VIEWCOUNT)))
  })

  describe('overlayEnabled property', () => {
    it('should double bind', () => testInputProperty('overlayEnabled', false))
    it('should expose setter function', () => testInputPropSetFunc('overlayEnabled', 'setOverlayEnabled', false))
    it('should start with token value',
      () => expect(createSutInstance().overlayEnabled).toEqual(TestBed.get(FLO_GRID_LIST_OVERLAY_ENABLED)))
  })

  describe('overlayStart property', () => {
    it('should double bind', () => testInputProperty('overlayStart', false))
    it('should expose setter function', () => testInputPropSetFunc('overlayStart', 'setOverlayStart', false))
    it('should start with token value', () => expect(createSutInstance().overlayStart).toEqual(TestBed.get(FLO_GRID_LIST_OVERLAY_START)))
  })


  describe('overlayFadeout property', () => {
    it('should double bind', () => testInputProperty('overlayFadeout', 76))
    it('should expose setter function', () => testInputPropSetFunc('overlayFadeout', 'setOverlayFadeout', 76))
    it('should start with token value',
      () => expect(createSutInstance().overlayFadeout).toEqual(TestBed.get(FLO_GRID_LIST_OVERLAY_FADEOUT)))
  })
  describe('overlayThrottle property', () => {
    it('should double bind', () => testInputProperty('overlayThrottle', 4))
    it('should expose setter function', () => testInputPropSetFunc('overlayThrottle', 'setOverlayThrottle', 4))
    it('should start with token value',
      () => expect(createSutInstance().overlayThrottle).toEqual(TestBed.get(FLO_GRID_LIST_OVERLAY_THROTTLE)))
  })
})
