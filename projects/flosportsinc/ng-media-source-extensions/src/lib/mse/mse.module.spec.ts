import { MseModule, falseFunc } from './mse.module'
import { TestBed } from '@angular/core/testing'

describe(MseModule.name, () => {
  it('Should construct', () => {
    TestBed.configureTestingModule({
      imports: [MseModule]
    })
  })

  it('Should use false values for default tokens', () => {
    expect(falseFunc()).toEqual(false)
  })
})
