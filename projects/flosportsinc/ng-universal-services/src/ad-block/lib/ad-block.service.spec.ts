import { TestBed } from '@angular/core/testing'
import { AdBlockService } from '../../../ad-block/src/lib/ad-block.service'
import { AdBlockModule } from '../../../ad-block/src/lib/ad-block.module'
import { NgModule, PLATFORM_ID } from '@angular/core'

@NgModule({
  imports: [AdBlockModule.withTestUrl('http://mysite.com/ads.js')]
})
export class AdBlockTestModule { }

describe(AdBlockService.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  describe('when on server platform', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AdBlockTestModule],
        providers: [{
          provide: PLATFORM_ID,
          useValue: 'server'
        }]
      })
    })
    it('should...', () => {
      const service: AdBlockService = TestBed.get(AdBlockService)
      service.isAnAdBlockerActive().subscribe(console.log)
      expect(service).toBeTruthy()
    })
  })
  describe('when on browser platform', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AdBlockTestModule],
        providers: [{
          provide: PLATFORM_ID,
          useValue: 'browser'
        }]
      })
    })
    it('should...', () => {
      const service: AdBlockService = TestBed.get(AdBlockService)
      service.isAnAdBlockerActive().subscribe(console.log, console.log)
      expect(service).toBeTruthy()
    })
  })
})
