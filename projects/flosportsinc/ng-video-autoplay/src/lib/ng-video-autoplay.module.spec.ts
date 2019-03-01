import { NgModule, Component } from '@angular/core'
import { FloVideoAutoplayModule } from './ng-video-autoplay.module'
import { TestBed, async } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { FloVideoAutoplayDirective } from './ng-video-autoplay.directive'

@Component({
  selector: 'flo-test-component',
  template: `<button #unmute>click to unmute</button>
  <video [floVideoAutoplay]="unmute" src="http://techslides.com/demos/sample-videos/small.mp4"></video>`
})
export class FloVideoAutoplayTestComponent { }

@NgModule({
  imports: [FloVideoAutoplayModule],
  exports: [FloVideoAutoplayModule],
  declarations: [FloVideoAutoplayTestComponent]
})
export class FloVideoAutoplayTestModule { }

export const createSut = () => {
  const hoist = TestBed.createComponent(FloVideoAutoplayTestComponent)
  hoist.autoDetectChanges()
  const directive = hoist.debugElement.query(By.directive(FloVideoAutoplayDirective))
  return {
    hoist,
    directive,
    instance: directive.injector.get(FloVideoAutoplayDirective)
  }
}

describe(FloVideoAutoplayModule.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloVideoAutoplayTestModule]
    }).compileComponents()
  }))

  it('should init', async(() => {
    const sut = createSut()
    expect(sut.hoist).toBeTruthy()
  }))
})
