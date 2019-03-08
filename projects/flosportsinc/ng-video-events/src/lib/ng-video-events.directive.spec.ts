import { FloVideoEventsDirective } from './ng-video-events.directive'
import { async, TestBed } from '@angular/core/testing'
import { FloVideoEventsTestModule, createSut } from './ng-video-events.module.spec'

describe(FloVideoEventsDirective.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloVideoEventsTestModule]
    }).compileComponents()
  }))

  it('should have proper uuid and tab ids', async(() => {
    const sut = createSut()
    sut.hoist.detectChanges()

    expect(sut.instances[0].uniqueId.length).toBeGreaterThan(7)
    expect(sut.instances[1].uniqueId.length).toBeGreaterThan(7)
    expect(sut.instances[0].windowId.length).toBeGreaterThan(7)
    expect(sut.instances[1].windowId.length).toBeGreaterThan(7)

    expect(sut.instances[0].windowId).toEqual(sut.instances[1].windowId)
    expect(sut.instances[0].uniqueId).not.toEqual(sut.instances[1].uniqueId)
  }))
})