import { FloVideoEventsDirective } from './ng-video-events.directive'
import { async, TestBed } from '@angular/core/testing'
import { FloVideoEventsTestModule, createSut } from './ng-video-events.module.spec'
import { VIDEO_PLAYER_EVENT_BINDINGS } from './ng-video-events.tokens'

describe(FloVideoEventsDirective.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloVideoEventsTestModule],
      providers: [
        {
          provide: VIDEO_PLAYER_EVENT_BINDINGS,
          multi: true,
          useValue: {
            canplay: (a, b, c, d, e, f, g) => {
              f('test message')
            }
          }
        },
        {
          provide: VIDEO_PLAYER_EVENT_BINDINGS,
          multi: true,
          useValue: {
            canplay: 1
          }
        }
      ]
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

  it('should emit messages', done => {
    const sut = createSut()
    sut.hoist.detectChanges()

    sut.instances[0].floVideoEventMessage.subscribe(msg => {
      expect(msg).toEqual('test message')
      done()
    })
  })

  it('should filter non-functions in dict', done => {
    const sut = createSut()
    sut.hoist.detectChanges()

    sut.instances[0].floVideoEventMessage.subscribe(msg => {
      expect(msg).toEqual('test message')
      done()
    })
  })
})
