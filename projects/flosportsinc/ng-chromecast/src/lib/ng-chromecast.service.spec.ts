import { TestBed } from '@angular/core/testing'
import { FloChromecastService } from './ng-chromecast.service'

describe(FloChromecastService.name, () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: FloChromecastService = TestBed.get(FloChromecastService)
    expect(service).toBeTruthy()
  })
})
