import { TestBed } from '@angular/core/testing'
import { FloAdBlockModule } from './ad-block.module'
import { AdBlockService } from './ad-block.service'
import { of } from 'rxjs'
import { AD_BLOCK_LOADER } from './ad-block.tokens'

describe(FloAdBlockModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloAdBlockModule]
    })
  })

  it('should fail without loader', () => {
    expect(() => TestBed.get(AdBlockService)).toThrowError()
  })

  it('should construct w/ loader', () => {
    TestBed.configureTestingModule({
      imports: [FloAdBlockModule],
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
