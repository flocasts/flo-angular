import { TestBed } from '@angular/core/testing'
import { FloAdBlockServerModule } from './ad-block.server.module'
import { AdBlockService } from '@flosportsinc/ng-ad-block'

describe(FloAdBlockServerModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloAdBlockServerModule]
    })
  })

  it('should construct', () => {
    const sut = TestBed.get(AdBlockService) as AdBlockService
    sut.isAnAdBlockerActive()
      .subscribe(res => expect(res).toEqual(false))
  })
})
