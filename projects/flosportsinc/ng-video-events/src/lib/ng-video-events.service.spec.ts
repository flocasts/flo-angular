import { TestBed } from '@angular/core/testing'
import { NgVideoEventsService } from './ng-video-events.service'

describe('NgVideoEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: NgVideoEventsService = TestBed.get(NgVideoEventsService)
    expect(service).toBeTruthy()
  })
})
