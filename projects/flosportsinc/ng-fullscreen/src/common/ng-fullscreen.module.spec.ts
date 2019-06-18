import { NgModule, Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FloFullscreenService } from './ng-fullscreen.service'
import { FloFullscreenCommonModule } from './ng-fullscreen.module'

@Component({
  selector: 'flo-test-component',
  template: `<span floFullscreen>I indicate fullscreen CTA</span>`
})
export class FloTestComponent { }

@NgModule({
  declarations: [FloTestComponent],
  imports: [FloFullscreenCommonModule],
  exports: [FloFullscreenCommonModule, FloTestComponent],
})
export class FloFullscreenTestModule { }

describe(FloFullscreenCommonModule.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule]
    }).compileComponents()
  })

  it('should compile', () => {
    expect(TestBed.get(FloFullscreenService)).toBeTruthy()
  })

  it('should compile', () => {
    expect(TestBed.createComponent(FloTestComponent)).toBeTruthy()
  })
})

