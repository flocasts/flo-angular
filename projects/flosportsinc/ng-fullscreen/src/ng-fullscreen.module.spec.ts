import { TestBed } from '@angular/core/testing'
import { FloFullscreenModule } from './ng-fullscreen.module'
import { FloFullscreenService } from './common/ng-fullscreen.service'
import { Component, NgModule } from '@angular/core'

@Component({
  selector: 'flo-test-component',
  template: `<div #ref>
    <button *floIfNotFullscreen [floClickToEnterFullscreen]="ref">ENTER</button>
    <button *floIfFullscreen floClickToExitFullscreen>EXIT</button>
  </div>`
})
export class FloTestComponent { }

@NgModule({
  declarations: [FloTestComponent],
  imports: [FloFullscreenModule],
  exports: [FloFullscreenModule],
})
export class FloFullscreenTestModule { }

describe(FloFullscreenModule.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule]
    }).compileComponents()
  })

  it('should compile', () => {
    const sut = TestBed.createComponent(FloTestComponent)
    expect(TestBed.get(FloFullscreenService)).toBeTruthy()
    expect(sut).toBeTruthy()
  })
})

