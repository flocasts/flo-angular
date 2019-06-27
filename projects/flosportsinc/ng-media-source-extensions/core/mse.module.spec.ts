import { FloMseModule, falseFunc } from './mse.module'
import { TestBed } from '@angular/core/testing'

describe(FloMseModule.name, () => {
  it('Should use false values for default tokens', () => {
    TestBed.configureTestingModule({
      imports: [FloMseModule]
    })
    expect(falseFunc()).toEqual(false)
  })
})
