import { FloGridListModule } from './ng-grid-list.module'
import { NgModule, Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'

@Component({
  selector: 'flo-grid-list-test',
  template: `
  <flo-grid-tiles #grid>
  </flo-grid-tiles>

  <h3>Grid List 1</h3>
  <flo-grid-list>
  </flo-grid-list>

  <h3>Grid List 2</h3>
  <flo-grid-list>
  </flo-grid-list>

  <h3>Grid List 3</h3>
  <flo-grid-list>
  </flo-grid-list>
  `
})
export class FloGridListTestComponent { }

@NgModule({
  imports: [FloGridListModule],
  declarations: [FloGridListTestComponent]
})
export class FloGridListTestingModule { }


describe(FloGridListModule.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [FloGridListTestingModule] }).compileComponents()
  })

  afterEach(() => TestBed.resetTestingModule())

  it('should construct', () => expect(new FloGridListModule()).toBeTruthy())

  it('', () => {
    const fixture = TestBed.createComponent(FloGridListTestComponent)
    fixture.detectChanges()
  })
})
