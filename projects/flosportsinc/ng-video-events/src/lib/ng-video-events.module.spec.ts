import { NgModule, Component, PLATFORM_ID } from '@angular/core'
import { FloVideoEventsModule } from './ng-video-events.module'
import { FloVideoEventsDirective } from './ng-video-events.directive'
import { TestBed, async } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import {
  VIDEO_PLAYER_EVENT_BINDINGS, VIDEO_PLAYER_EVENT_UUID_GENERATOR,
  VIDEO_PLAYER_EVENT_UUID_TAB_GENERATOR
} from './ng-video-events.tokens'

@Component({
  selector: 'flo-test-component',
  template: `<video floVideoEvents src="http://techslides.com/demos/sample-videos/small.mp4"></video>
  <video floVideoEvents src="http://techslides.com/demos/sample-videos/small.mp4"></video>`
})
export class FloVideoEventsTestComponent { }

@NgModule({
  imports: [FloVideoEventsModule],
  declarations: [FloVideoEventsTestComponent]
})
export class FloVideoEventsTestModule { }

export const createSut = () => {
  const hoist = TestBed.createComponent(FloVideoEventsTestComponent)
  hoist.autoDetectChanges()
  const directive = hoist.debugElement.queryAll(By.directive(FloVideoEventsDirective))
  return {
    hoist,
    directive,
    instances: directive.map(a => a.injector.get(FloVideoEventsDirective))
  }
}

describe(FloVideoEventsModule.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloVideoEventsTestModule]
    }).compileComponents()
  }))
  afterEach(TestBed.resetTestingModule)

  it('should construct', async(() => {
    const sut = createSut()
    sut.hoist.detectChanges()
    expect(sut.hoist).toBeTruthy()
    expect(sut.instances.length).toEqual(2)
  }))

  it('should default to empty event bindings', async(() => {
    const sut = createSut()
    sut.hoist.detectChanges()
    expect(TestBed.get(VIDEO_PLAYER_EVENT_BINDINGS)).toEqual([{}])
  }))

  it('should have default uuid gen', async(() => {
    const sut = createSut()
    sut.hoist.detectChanges()
    expect(TestBed.get(VIDEO_PLAYER_EVENT_UUID_GENERATOR)()).toBeTruthy()
  }))

  it('should have default uuid tab gen', async(() => {
    const sut = createSut()
    sut.hoist.detectChanges()
    expect(TestBed.get(VIDEO_PLAYER_EVENT_UUID_TAB_GENERATOR)()).toBeTruthy()
  }))

  it('should set storage for tab id', async(() => {
    sessionStorage.clear()
    const spy = spyOn(sessionStorage, 'setItem').and.callThrough()
    const sut = createSut()
    sut.hoist.detectChanges()
    expect(spy).toHaveBeenCalled()
  }))

  it('should handle server case', async(() => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloVideoEventsTestModule],
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'server'
        }
      ]
    }).compileComponents()
    const sut = createSut()
    sut.hoist.detectChanges()
    expect(TestBed.get(VIDEO_PLAYER_EVENT_UUID_TAB_GENERATOR)()).toEqual('')
  }))
})
