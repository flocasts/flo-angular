import { TestBed } from '@angular/core/testing'
import { FloFullscreenCommonModule } from './ng-fullscreen.module'
import {
  FS_FULLSCREEN_REQUEST_EVENTS, FS_FULLSCREEN_EXIT_EVENTS, FS_FULLSCREEN_CHANGE_EVENTS,
  FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, FS_FULLSCREEN_ELEMENT, FS_FULLSCREEN_ENABLED
} from './ng-fullscreen.tokens'
import {
  DEFAULT_FS_FULLSCREEN_REQUEST_EVENTS, DEFAULT_FS_FULLSCREEN_EXIT_EVENTS,
  DEFAULT_FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, DEFAULT_FS_FULLSCREEN_ELEMENT,
  DEFAULT_FS_FULLSCREEN_CHANGE_EVENTS, DEFAULT_FS_FULLSCREEN_ENABLED
} from './ng-fullscreen.tokens.defaults'

// @Component({
//   selector: 'flo-test-component',
//   template: `<span>I indicate fullscreen CTA</span>`
// })
// export class FloTestComponent { }

// @NgModule({
//   declarations: [FloTestComponent],
//   imports: [FloFullscreenCommonModule],
//   exports: [FloFullscreenCommonModule, FloTestComponent],
// })
// export class FloFullscreenTestModule { }

describe(FloFullscreenCommonModule.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloFullscreenCommonModule]
    })
  })

  it('should use module defaults', () => {
    expect(TestBed.get(FS_FULLSCREEN_REQUEST_EVENTS)).toEqual(DEFAULT_FS_FULLSCREEN_REQUEST_EVENTS)

    expect(TestBed.get(FS_FULLSCREEN_EXIT_EVENTS)).toEqual(DEFAULT_FS_FULLSCREEN_EXIT_EVENTS)
    expect(TestBed.get(FS_FULLSCREEN_CHANGE_EVENTS)).toEqual(DEFAULT_FS_FULLSCREEN_CHANGE_EVENTS)
    expect(TestBed.get(FS_FULLSCREEN_ELEMENT_ERROR_EVENTS)).toEqual(DEFAULT_FS_FULLSCREEN_ELEMENT_ERROR_EVENTS)
    expect(TestBed.get(FS_FULLSCREEN_ELEMENT)).toEqual(DEFAULT_FS_FULLSCREEN_ELEMENT)
    expect(TestBed.get(FS_FULLSCREEN_ENABLED)).toEqual(DEFAULT_FS_FULLSCREEN_ENABLED)
  })
})

