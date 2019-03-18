import { NgModule, Component } from '@angular/core'
import { FloVideoAutoplayModule } from './ng-video-autoplay.module'
import { TestBed, async } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { FloVideoAutoplayDirective } from './ng-video-autoplay.directive'

@Component({
  selector: 'flo-test-component',
  template: `<button #unmuteBtnRef>click to unmute</button>
  <button #playBtnRef>click to play</button>
  <video floVideoAutoplay
    [floVideoAutoplayClickUnmuteRef]="unmuteBtnRef"
    [floVideoAutoplayClickPlayRef]="playBtnRef"
    src="http://techslides.com/demos/sample-videos/small.mp4">
  </video>`
})
export class FloVideoAutoplayTestComponent { }

@Component({
  selector: 'flo-test-component',
  template: `<button #unmute>click to unmute</button>
  <button #play>click to play</button>
  <video [floVideoAutoplay]="false" src="http://techslides.com/demos/sample-videos/small.mp4">
  </video>`
})
export class FloVideoAutoplayTestDisabledComponent { }

@Component({
  selector: 'flo-mutli-test-component',
  template: `
  <div floVideoAutoplay [floVideoAutoplayClickUnmuteRef]="unmute" [floVideoAutoplayClickPlayRef]="play">
    <button #unmute>click to unmute</button>
    <button #play>click to play</button>
    <video #floVideoAutoplay src="http://techslides.com/demos/sample-videos/small.mp4"></video>
    <video #floVideoAutoplay src="http://techslides.com/demos/sample-videos/small.mp4"></video>
  </div>
`
})
export class FloVideoAutoplayMultiTestComponent { }


@NgModule({
  imports: [FloVideoAutoplayModule],
  exports: [FloVideoAutoplayModule],
  declarations: [FloVideoAutoplayTestComponent, FloVideoAutoplayMultiTestComponent, FloVideoAutoplayTestDisabledComponent]
})
export class FloVideoAutoplayTestModule { }

export const createSut = (comp: any = FloVideoAutoplayTestComponent) => {
  const hoist = TestBed.createComponent(comp)
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
