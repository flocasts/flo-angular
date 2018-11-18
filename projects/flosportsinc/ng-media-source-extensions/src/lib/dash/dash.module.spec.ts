import { TestBed } from '@angular/core/testing'
import { DashModule } from './dash.module'

describe(DashModule.name, () => {
  it('should construct', () => {
    TestBed.configureTestingModule({
      imports: [DashModule]
    })
  })
})
