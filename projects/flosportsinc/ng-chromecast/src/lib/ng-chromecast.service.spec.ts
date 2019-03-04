import { TestBed } from '@angular/core/testing'
import { NgChromecastService } from './ng-chromecast.service'

describe('NgChromecastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: NgChromecastService = TestBed.get(NgChromecastService)
    expect(service).toBeTruthy()
  })
})
