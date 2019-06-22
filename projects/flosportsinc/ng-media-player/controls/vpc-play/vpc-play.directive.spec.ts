import { Component, NgModule, Type } from '@angular/core'
import { FloMediaPlayerControlsPlayModule } from './vpc-play.module'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'
import { FloVideoPlayerPlayControlDirective } from './vpc-play.directive'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Component({
  selector: 'flo-test-component-a1',
  template: `<video #videoRef></video><button [floVpc]="videoRef" [floVpcMeta]="meta" floVpcPlay>PLAY</button>`
})
export class FloTestA1Component {
  meta: { test: 123 }
}

@Component({
  selector: 'flo-test-component-a2',
  template: `<video #videoRef></video><button floVpc floVpcPlay>PLAY</button>`
})
export class FloTestA2Component { }

@Component({
  selector: 'flo-test-component-a3',
  template: `<video #videoRef></video><button [floVpc]="videoRef" [floVpcPlay]="false">PLAY</button>`
})
export class FloTestA3Component { }

@NgModule({
  declarations: [FloTestA1Component, FloTestA2Component, FloTestA3Component],
  imports: [CommonModule, FloMediaPlayerControlsPlayModule]
})
export class TestModule { }

const createsut = (type: Type<any>) => {
  const fixture = TestBed.createComponent(type)
  fixture.detectChanges()
  const videoElement = fixture.debugElement.query(By.css('video')).nativeElement as HTMLVideoElement | HTMLAudioElement
  const btnElement = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement
  return {
    fixture,
    videoElement,
    btnElement
  }
}

describe(FloVideoPlayerPlayControlDirective.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents()
  })

  afterEach(() => {
    TestBed.resetTestingModule()
  })

  it('should play video when clicked', () => {
    const sut = createsut(FloTestA1Component)
    const spy = spyOn(sut.videoElement, 'play').and.callThrough()
    sut.btnElement.click()
    expect(spy).toHaveBeenCalled()
  })

  it('should do nothing when clicked without a media element reference', () => {
    const sut = createsut(FloTestA2Component)
    const spy = spyOn(sut.videoElement, 'play').and.callThrough()
    sut.btnElement.click()
    expect(spy).not.toHaveBeenCalled()
  })

  it('should do nothing when clicked and input set to false', () => {
    const sut = createsut(FloTestA3Component)
    const spy = spyOn(sut.videoElement, 'play').and.callThrough()
    sut.btnElement.click()
    expect(spy).not.toHaveBeenCalled()
  })
})
