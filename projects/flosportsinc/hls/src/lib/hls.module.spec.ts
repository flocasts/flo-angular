import { HlsModule } from './hls.module'
import { TestBed } from '@angular/core/testing'

describe(HlsModule.name, () => {
  it('Should construct', () => {
    TestBed.configureTestingModule({
      imports: [HlsModule]
    })
  })
})
