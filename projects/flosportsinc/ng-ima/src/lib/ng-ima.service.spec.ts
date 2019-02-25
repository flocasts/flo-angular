import { TestBed } from '@angular/core/testing'
import { NgImaService } from './ng-ima.service'

describe('NgImaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: NgImaService = TestBed.get(NgImaService)
    expect(service).toBeTruthy()
  })
})
