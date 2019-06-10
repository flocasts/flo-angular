import { TestBed } from '@angular/core/testing'
import { AdBlockModule } from './ad-block.module'
import { AdBlockService } from './ad-block.service'
import { of } from 'rxjs'
import { AD_BLOCK_LOADER } from './ad-block.tokens'

describe(AdBlockModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdBlockModule]
    })
  })

  it('should fail without loader', () => {
    expect(() => TestBed.get(AdBlockService)).toThrowError()
  })

  it('should construct w/ loader', () => {
    TestBed.configureTestingModule({
      imports: [AdBlockModule],
      providers: [
        { provide: AD_BLOCK_LOADER, useValue: of(false) }
      ]
    })
    const sut = TestBed.get(AdBlockService) as AdBlockService

    sut.isAnAdBlockerActive().subscribe(res => {
      expect(res).toEqual(false)
    })
  })
})
