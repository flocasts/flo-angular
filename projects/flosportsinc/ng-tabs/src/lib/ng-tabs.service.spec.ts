import { TestBed } from '@angular/core/testing'
import { NgTabsService } from './ng-tabs.service'

describe(NgTabsService.name, () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: NgTabsService = TestBed.get(NgTabsService)
    expect(service).toBeTruthy()
  })
})
