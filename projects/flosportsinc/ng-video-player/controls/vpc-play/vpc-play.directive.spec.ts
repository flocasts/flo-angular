import { Component, NgModule } from '@angular/core'
import { FloMediaPlayerControlsPlayModule } from './vpc-play.module'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'
import { FloVideoPlayerPlayControlDirective } from './vpc-play.directive'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Component({
  selector: 'flo-test-component',
  template: `<video #videoRef></video><button [floVpc]="videoRef" [floVpcMeta]="meta" floVpcPlay>PLAY</button>`
})
export class FloTestComponent {
  meta: { test: 123 }
}

@NgModule({
  declarations: [FloTestComponent],
  imports: [CommonModule, FloMediaPlayerControlsPlayModule]
})
export class TestModule { }

const createsut = () => {
  const fixture = TestBed.createComponent(FloTestComponent)
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
    const sut = createsut()
    const spy = spyOn(sut.videoElement, 'play').and.callThrough()
    sut.btnElement.click()
    expect(spy).toHaveBeenCalled()
  })
})
