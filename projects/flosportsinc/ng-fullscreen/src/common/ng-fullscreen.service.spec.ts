import { TestBed } from '@angular/core/testing'
import { FloFullscreenService } from './ng-fullscreen.service'
import { FloFullscreenCommonModule } from './ng-fullscreen.module'

describe(FloFullscreenService.name, () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FloFullscreenCommonModule]
  }))

  it('should be created', () => {
    expect(TestBed.get(FloFullscreenService)).toBeTruthy()
  })
})
