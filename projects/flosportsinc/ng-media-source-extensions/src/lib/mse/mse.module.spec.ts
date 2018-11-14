import { MseModule } from './mse.module'
import { TestBed } from '@angular/core/testing'

describe(MseModule.name, () => {
  it('Should construct', () => {
    TestBed.configureTestingModule({
      imports: [MseModule]
    })
  })
})
