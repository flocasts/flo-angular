import { TestBed } from '@angular/core/testing'
import { AdBlockModule } from './ad-block.module'
import { AdBlockService } from './ad-block.service'

describe(AdBlockModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdBlockModule]
    })
  })

  it('should construct', () => {
    expect(() => TestBed.get(AdBlockService)).toThrowError()
  })
})
