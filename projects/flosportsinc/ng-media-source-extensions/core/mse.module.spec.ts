import { MseModule, falseFunc } from './mse.module'
import { TestBed } from '@angular/core/testing'

describe(MseModule.name, () => {
  it('Should use false values for default tokens', () => {
    TestBed.configureTestingModule({
      imports: [MseModule]
    })
    expect(falseFunc()).toEqual(false)
  })
})
