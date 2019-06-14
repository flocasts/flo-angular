import { TestBed } from '@angular/core/testing'
import { FloFullscreenService } from './ng-fullscreen.service'

describe(FloFullscreenService.name, () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    expect(TestBed.get(FloFullscreenService)).toBeTruthy()
  })
})
