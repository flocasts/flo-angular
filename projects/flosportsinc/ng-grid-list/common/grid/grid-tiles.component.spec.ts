import { async, TestBed } from '@angular/core/testing'
import { FloGridTilesComponent } from './grid-tiles.component'
import { Component } from '@angular/core'
import { FloGridListModule, DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT } from '../ng-grid-list.module'
import { FLO_GRID_LIST_MIN_VIEWCOUNT, FLO_GRID_LIST_MAX_VIEWCOUNT } from '../ng-grid-list.tokens'

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

const testInputProperty = (prop: string, testNumber: number, ) => {
  const sut = TestBed.createComponent(FloGridTilesComponent)
  sut.componentInstance[prop] = testNumber
  sut.detectChanges()
  expect(sut.componentInstance[prop]).toEqual(testNumber)
  sut.componentInstance[`${prop}Change`].toPromise().then((ve: number) => expect(ve).toEqual(testNumber))
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

  describe('viewcount property', () => {
    it('should double bind', () => testInputProperty('count', 10))

    it('should expose setViewcount()', () => {
      const sut = TestBed.createComponent(FloGridTilesComponent)
      const testNumber = 13

      sut.componentInstance.setCount(testNumber)
      sut.detectChanges()
      expect(sut.componentInstance.count).toEqual(testNumber)
      sut.componentInstance.countChange.toPromise().then(ve => expect(ve).toEqual(testNumber))
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
    it('should start with token value', () => expect(createSutInstance().min).toEqual(TestBed.get(FLO_GRID_LIST_MIN_VIEWCOUNT)))
  })

  describe('max property', () => {
    it('should double bind', () => testInputProperty('max', 52))
    it('should start with token value', () => expect(createSutInstance().max).toEqual(TestBed.get(FLO_GRID_LIST_MAX_VIEWCOUNT)))
  })
})
