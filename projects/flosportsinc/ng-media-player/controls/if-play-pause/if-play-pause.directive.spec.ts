import { By } from '@angular/platform-browser'
import { maybe } from 'typescript-monads'
import { TestBed } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { Component, NgModule } from '@angular/core'
import { FloMediaIfPlayPauseModule } from './if-play-pause.module'
import { FloMediaIfPausedDirective, FloMediaIfPlayingDirective } from './if-play-pause.directive'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Component({
  selector: 'flo-test-component',
  template: `<video #videoRef></video>
    <button id="playBtn" *floIfMediaPaused="videoRef">PLAY</button>
    <button id="pauseBtn" *floIfMediaPlaying="videoRef">PAUSE</button>
  `
})
export class FloTestComponent { }

@NgModule({
  declarations: [FloTestComponent],
  imports: [CommonModule, FloMediaIfPlayPauseModule]
})
export class TestModule { }

const createsut = () => {
  const fixture = TestBed.createComponent(FloTestComponent)
  fixture.detectChanges()
  const videoElement = fixture.debugElement.query(By.css('video')).nativeElement as HTMLVideoElement
  const playBtnElement = () => maybe(fixture.debugElement.query(By.css('#playBtn'))).map<HTMLButtonElement>(a => a.nativeElement)
  const pauseBtnElement = () => maybe(fixture.debugElement.query(By.css('#pauseBtn'))).map<HTMLButtonElement>(a => a.nativeElement)
  return {
    fixture,
    videoElement,
    playBtnElement,
    pauseBtnElement
  }
}

describe(FloMediaIfPlayPauseModule.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents()
  })

  afterEach(() => TestBed.resetTestingModule())

  it('should compile', () => {
    expect(createsut().fixture).toBeTruthy()
  })

  describe(FloMediaIfPlayingDirective.name, () => {
    it('should render when media playing', () => {
      const sut = createsut()
      sut.videoElement.dispatchEvent(new Event('play'))
      sut.fixture.detectChanges()
      sut.pauseBtnElement().tap({
        some: btn => expect(btn.innerText).toEqual('PAUSE'),
        none: () => expect(true).toEqual(false)
      })
    })

    it('should remove when media is paused', () => {
      const sut = createsut()
      sut.videoElement.dispatchEvent(new Event('pause'))
      sut.fixture.detectChanges()
      sut.pauseBtnElement().tap({
        some: _ => expect(false).toEqual(true),
        none: () => expect(true).toEqual(true)
      })
    })
  })

  describe(FloMediaIfPausedDirective.name, () => {
    it('should render when media paused', () => {
      const sut = createsut()
      sut.videoElement.dispatchEvent(new Event('pause'))
      sut.fixture.detectChanges()
      sut.playBtnElement().tap({
        some: btn => expect(btn.innerText).toEqual('PLAY'),
        none: () => expect(true).toEqual(false)
      })
    })

    it('should remove when media is not paused', () => {
      const sut = createsut()
      sut.videoElement.dispatchEvent(new Event('play'))
      sut.fixture.detectChanges()
      sut.playBtnElement().tap({
        some: _ => expect(false).toEqual(true),
        none: () => expect(true).toEqual(true)
      })
    })
  })
})
