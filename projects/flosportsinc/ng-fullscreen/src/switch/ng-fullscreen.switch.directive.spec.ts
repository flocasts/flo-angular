import { Component, NgModule } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FloFullscreenDirective, FloFullscreenOffDirective } from './ng-fullscreen.switch.directive'
import { FloFullscreenSwitchModule } from './ng-fullscreen.switch.module'
import { By } from '@angular/platform-browser'
import { FloFullscreenService } from '../common/ng-fullscreen.service'
import { of } from 'rxjs'
import { FS_FULLSCREEN_ENABLED, FS_FULLSCREEN_ELEMENT } from '../common/ng-fullscreen.tokens'
import { DOCUMENT } from '@angular/common'

@Component({
  selector: 'flo-test-component',
  template: `<div id="container">
    <video #ref></video>
    <button *floIfNotFullscreen="ref">ENTER</button>
    <button *floIfFullscreen="ref">EXIT</button>
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
    })
  })

  it('should compile', () => {
    expect(createSut()).toBeTruthy()
  })

  it('should show ifNotFullscreen element', () => {
    const sut = createSut()
    const container = sut.debugElement.query(By.css('#container'))
    const tag = container.query(By.css('button'))
    expect(tag.nativeElement.innerText).toEqual('ENTER')
  })

  it('should show floIfFullscreen element', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule],
      providers: [
        { provide: FloFullscreenService, useValue: { fullscreen$: of(true), fullscreenIsSupported: () => of(true) } }
      ]
    })

    const sut = createSut()
    sut.detectChanges()
    const container = sut.debugElement.query(By.css('#container'))
    const tag = container.query(By.css('button'))
    expect(tag.nativeElement.innerText).toEqual('EXIT')
  })

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
})
