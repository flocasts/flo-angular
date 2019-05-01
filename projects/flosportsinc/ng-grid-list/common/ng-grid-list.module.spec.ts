import { FloGridListModule } from './ng-grid-list.module'
import { TestBed } from '@angular/core/testing'

describe(FloGridListModule.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloGridListModule]
    })
  })
  afterEach(() => TestBed.resetTestingModule())

  it('should import', () => {
    expect(new FloGridListModule()).toBeTruthy() // placeholder until tests are needed, if ever
  })
})
