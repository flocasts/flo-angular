import { TestBed } from '@angular/core/testing'
import { WindowFrameService } from './window-frame.service'

describe('WindowFrameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: WindowFrameService = TestBed.get(WindowFrameService)
    expect(service).toBeTruthy()
  })
})
