import { Component, NgModule } from '@angular/core'
import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing'
import { FloFullscreenDirective, FloFullscreenOffDirective } from './ng-fullscreen.switch.directive'
import { FloFullscreenSwitchModule } from './ng-fullscreen.switch.module'
import { By } from '@angular/platform-browser'
import { FloFullscreenService } from '../common/ng-fullscreen.service'
import { of } from 'rxjs'
import { FS_FULLSCREEN_ENABLED, FS_FULLSCREEN_ELEMENT, FS_FULLSCREEN_IOS_POLL_ENABLED } from '../common/ng-fullscreen.tokens'
import { DOCUMENT } from '@angular/common'
import { skip } from 'rxjs/operators'
import { DEFAULT_FS_FULLSCREEN_IOS_POLL_MS } from '../common/ng-fullscreen.tokens.defaults'

@Component({
  selector: 'flo-test-component',
  template: `<div id="container">
    <video #ref1></video>
    <video #ref2></video>
    <div #ref3> <video></video></div>
    <button *floIfNotFullscreen="ref1">ENTER</button>
    <button *floIfNotFullscreen="ref3">ENTER</button>
    <button *floIfFullscreen="ref1">EXIT</button>
  </div>`
})
export class FloTestComponent { }

@NgModule({
  declarations: [FloTestComponent],
  imports: [FloFullscreenSwitchModule],
  exports: [FloFullscreenSwitchModule, FloTestComponent],
})
export class FloFullscreenTestModule { }

const createSut = () => {
  const sut = TestBed.createComponent(FloTestComponent)
  sut.detectChanges()
  return sut
}

describe(FloFullscreenDirective.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule]
    }).compileComponents()
  })

  it('should compile', () => {
    expect(createSut()).toBeTruthy()
  })

  it('should show ifNotFullscreen element', fakeAsync(() => {
    const sut = createSut()
    tick(15)
    const container = sut.debugElement.query(By.css('#container'))
    const tag = container.query(By.css('button'))
    sut.detectChanges()
    expect(tag.nativeElement.innerText).toEqual('ENTER')
    discardPeriodicTasks()
  }))

  it('should show floIfFullscreen element', fakeAsync(() => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule],
      providers: [
        { provide: FloFullscreenService, useValue: { fullscreen$: of(true), fullscreenIsSupported: () => of(true) } }
      ]
    })

    const sut = createSut()
    tick(15)
    sut.detectChanges()
    const container = sut.debugElement.query(By.css('#container'))
    const tag = container.query(By.css('button'))
    expect(tag.nativeElement.innerText).toEqual('EXIT')
    discardPeriodicTasks()
  }))

  it('should not render when fullscreenIsSupported returns false', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule],
      providers: [
        { provide: FloFullscreenService, useValue: { fullscreen$: of(true), fullscreenIsSupported: () => of(false) } }
      ]
    })

    const sut = createSut()
    sut.detectChanges()
    const container = sut.debugElement.query(By.css('#container'))
    const tag = container.query(By.css('button'))
    expect(tag).toBeFalsy()
  })

  it('should support ios fullscreen', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule],
      providers: [
        { provide: FS_FULLSCREEN_ENABLED, useValue: []},
        // { provide: FS_FULLSCREEN_ELEMENT, useValue: []}
        // { provide: DOCUMENT, useValue: { fullscreenElement: false } }
      ]
    })
    const sut = createSut()
    sut.detectChanges()
    const service = TestBed.get(FloFullscreenService) as FloFullscreenService
    const video = sut.debugElement.query(By.css('video'))
    const loadedmetadata = new Event('loadedmetadata')
    video.nativeElement.dispatchEvent(loadedmetadata)
    service.canGoFullscreen(video.nativeElement).subscribe(res => expect(res).toEqual(true))
  })

  it('should handle empty case', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule],
      providers: [
        { provide: FS_FULLSCREEN_ENABLED, useValue: []}
      ]
    })
    const sut = createSut()
    sut.detectChanges()
    const service = TestBed.get(FloFullscreenService) as FloFullscreenService
    service.canGoFullscreen().subscribe(res => expect(res).toEqual(false))
  })

  it('should handle iOS entering/exiting fullscreen', fakeAsync(() => {
    spyOnProperty(window.navigator, 'userAgent').and.returnValue('iPhone')
    const sut = createSut()
    const video = sut.debugElement.query(By.css('video'))
    video.triggerEventHandler('webkitbeginfullscreen', { })
    sut.detectChanges()

    tick(DEFAULT_FS_FULLSCREEN_IOS_POLL_MS)

    // TODO

    discardPeriodicTasks()
  }))

  it('should... ', fakeAsync(() => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule],
      providers: [
        { provide: FS_FULLSCREEN_IOS_POLL_ENABLED, useValue: false }
      ]
    })
    const service = TestBed.get(FloFullscreenService) as FloFullscreenService
    const spy = spyOn(service as any, 'iOSVideoState').and.callThrough()
    const sut = createSut()
    const video = sut.debugElement.query(By.css('video'))
    video.nativeElement.dispatchEvent(new Event('webkitbeginfullscreen'))
    sut.detectChanges()

    tick(DEFAULT_FS_FULLSCREEN_IOS_POLL_MS)

    expect(spy).not.toHaveBeenCalled()

    discardPeriodicTasks()
  }))

})
