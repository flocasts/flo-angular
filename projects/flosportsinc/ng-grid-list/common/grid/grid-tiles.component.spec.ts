import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FloGridTilesComponent } from './grid-tiles.component'
import { Component } from '@angular/core'
import { FloGridListModule } from '../ng-grid-list.module'
import { take } from 'rxjs/operators'

// @Component({
//   selector: 'flo-grid-tiles-test-component',
//   template: `
//     <flo-grid-tiles [(viewcount)]="viewcount"></flo-grid-tiles>
//   `
// })
// export class FloGridTilesTestComponent {
//   readonly viewcount = 12
// }

const createSut = () => {
  const fixture = TestBed.createComponent(FloGridTilesComponent)
  fixture.detectChanges()
  return fixture
}

// tslint:disable: no-object-mutation
describe(FloGridTilesComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloGridListModule]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(createSut().componentInstance).toBeTruthy()
  })

  it('should double bind viewcount input property', () => {
    const fix = TestBed.createComponent(FloGridTilesComponent)
    const testNumber = 10
    fix.componentInstance.viewcount = testNumber
    fix.detectChanges()
    expect(fix.componentInstance.viewcount).toEqual(testNumber)
    fix.componentInstance.viewcountChange.subscribe(ve => expect(ve).toEqual(testNumber))
  })
})
