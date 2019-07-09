import { Component, NgModule } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FloFullscreenDirective } from './ng-fullscreen.switch.directive'
import { FloFullscreenSwitchModule } from './ng-fullscreen.switch.module'
import { By } from '@angular/platform-browser'
import { FloFullscreenService } from '../common/ng-fullscreen.service'
import { of } from 'rxjs'

@Component({
  selector: 'flo-test-component',
  template: `<div id="container">
    <button *floIfNotFullscreen>ENTER</button>
    <button *floIfFullscreen>EXIT</button>
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
})
