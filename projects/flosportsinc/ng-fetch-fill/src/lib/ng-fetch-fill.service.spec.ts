import { TestBed } from '@angular/core/testing'
import { FloFetchFillService } from './ng-fetch-fill.service'

describe('NgFetchFillService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: FloFetchFillService = TestBed.get(FloFetchFillService)
    expect(service).toBeTruthy()
  })
})
