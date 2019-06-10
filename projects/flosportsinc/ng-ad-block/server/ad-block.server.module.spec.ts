import { TestBed } from '@angular/core/testing'
import { AdBlockServerModule } from './ad-block.server.module'
import { AdBlockService } from '@flosportsinc/ng-ad-block'

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
