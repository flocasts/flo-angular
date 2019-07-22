import { Component, NgModule, Type, PLATFORM_ID } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'
import { FloMediaPlayerPlayControlDirective } from './mp-play.directive'
import { FloMediaPlayerControlsPlayModule } from './mp-play.module'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Component({
  selector: 'flo-test-component-a1',
  template: `<video #videoRef></video><button [floMp]="videoRef" [floMpMeta]="meta" floMpClickToPlay>PLAY</button>`
})
export class FloTestA1Component {
  meta: { test: 123 }
}

@Component({
  selector: 'flo-test-component-a2',
  template: `<video #videoRef></video><button floMp floMpClickToPlay>PLAY</button>`
})
export class FloTestA2Component { }

@Component({
  selector: 'flo-test-component-a3',
  template: `<video #videoRef></video><button [floMp]="videoRef" [floMpClickToPlay]="false">PLAY</button>`
})
export class FloTestA3Component { }

@NgModule({
  declarations: [FloTestA1Component, FloTestA2Component, FloTestA3Component],
  imports: [CommonModule, FloMediaPlayerControlsPlayModule],
  exports: [FloMediaPlayerControlsPlayModule]
})
export class TestModule { }

const createsut = <T>(type: Type<T>) => {
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

describe(FloMediaPlayerPlayControlDirective.name, () => {
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

  it('should not process on server', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'server'
        }
      ]
    })
    const sut = createsut(FloTestA2Component)
    const spy = spyOn(sut.videoElement, 'play').and.callThrough()
    sut.btnElement.click()
    expect(spy).not.toHaveBeenCalled()
  })
})
