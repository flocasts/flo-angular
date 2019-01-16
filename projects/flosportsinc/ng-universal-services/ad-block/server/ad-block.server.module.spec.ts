import { TestBed } from '@angular/core/testing'
import { AdBlockServerModule } from './ad-block.server.module'
import { AdBlockService } from './ad-block.service'

describe(AdBlockServerModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdBlockServerModule]
    })
  })

  it('should construct', () => {
    const sut = TestBed.get(AdBlockService) as AdBlockService
    sut.isAnAdBlockerActive()
      .subscribe(res => expect(res).toEqual(false))
  })
})
