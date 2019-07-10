import { TestBed } from '@angular/core/testing'
import { FloFullscreenCommonModule } from './ng-fullscreen.module'
import {
  FS_FULLSCREEN_REQUEST_EVENTS, FS_FULLSCREEN_EXIT_EVENTS, FS_FULLSCREEN_CHANGE_EVENTS,
  FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, FS_FULLSCREEN_ELEMENT, FS_FULLSCREEN_ENABLED,
  FS_FULLSCREEN_IOS_POLL_ENABLED, FS_FULLSCREEN_IOS_POLL_MS
} from './ng-fullscreen.tokens'
import {
  DEFAULT_FS_FULLSCREEN_REQUEST_EVENTS, DEFAULT_FS_FULLSCREEN_EXIT_EVENTS,
  DEFAULT_FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, DEFAULT_FS_FULLSCREEN_ELEMENT,
  DEFAULT_FS_FULLSCREEN_CHANGE_EVENTS, DEFAULT_FS_FULLSCREEN_ENABLED,
  DEFAULT_FS_FULLSCREEN_IOS_POLL_ENABLED, DEFAULT_FS_FULLSCREEN_IOS_POLL_MS
} from './ng-fullscreen.tokens.defaults'

describe(FloFullscreenCommonModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  it('should use module defaults', () => {
    TestBed.configureTestingModule({
      imports: [FloFullscreenCommonModule]
    })
    expect(TestBed.get(FS_FULLSCREEN_REQUEST_EVENTS)).toEqual(DEFAULT_FS_FULLSCREEN_REQUEST_EVENTS)

    expect(TestBed.get(FS_FULLSCREEN_EXIT_EVENTS)).toEqual(DEFAULT_FS_FULLSCREEN_EXIT_EVENTS)
    expect(TestBed.get(FS_FULLSCREEN_CHANGE_EVENTS)).toEqual(DEFAULT_FS_FULLSCREEN_CHANGE_EVENTS)
    expect(TestBed.get(FS_FULLSCREEN_ELEMENT_ERROR_EVENTS)).toEqual(DEFAULT_FS_FULLSCREEN_ELEMENT_ERROR_EVENTS)
    expect(TestBed.get(FS_FULLSCREEN_ELEMENT)).toEqual(DEFAULT_FS_FULLSCREEN_ELEMENT)
    expect(TestBed.get(FS_FULLSCREEN_ENABLED)).toEqual(DEFAULT_FS_FULLSCREEN_ENABLED)
  })

  describe('ios configuration', () => {
    it('should handle complete config', () => {
      TestBed.configureTestingModule({
        imports: [
          FloFullscreenCommonModule.config({
            ios: {
              enabled: true,
              pollDurationMs: 100
            }
          })
        ]
      })

      expect(TestBed.get(FS_FULLSCREEN_IOS_POLL_ENABLED)).toEqual(true)
      expect(TestBed.get(FS_FULLSCREEN_IOS_POLL_MS)).toEqual(100)
    })
    it('should handle setting only poll duration', () => {
      TestBed.configureTestingModule({
        imports: [
          FloFullscreenCommonModule.config({
            ios: {
              pollDurationMs: 50
            }
          })
        ]
      })

      expect(TestBed.get(FS_FULLSCREEN_IOS_POLL_ENABLED)).toEqual(DEFAULT_FS_FULLSCREEN_IOS_POLL_ENABLED)
      expect(TestBed.get(FS_FULLSCREEN_IOS_POLL_MS)).toEqual(50)
    })
    it('should handle disabling ', () => {
      TestBed.configureTestingModule({
        imports: [
          FloFullscreenCommonModule.config({
            ios: {
              enabled: false
            }
          })
        ]
      })

      expect(TestBed.get(FS_FULLSCREEN_IOS_POLL_ENABLED)).toEqual(false)
      expect(TestBed.get(FS_FULLSCREEN_IOS_POLL_MS)).toEqual(DEFAULT_FS_FULLSCREEN_IOS_POLL_MS)
    })
  })
})

