import { FloVideoAutoplayDirective } from './ng-video-autoplay.directive'
import { TestBed, async } from '@angular/core/testing'
import { FloVideoAutoplayTestModule, createSut } from './ng-video-autoplay.module.spec'
import { By } from '@angular/platform-browser'

describe(FloVideoAutoplayDirective.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloVideoAutoplayTestModule]
    }).compileComponents()
  }))

  it('should init', async(() => {
    const sut = createSut()
    expect(sut).toBeTruthy()
  }))

  it('should unmute when ref element clicked', async(() => {
    const sut = createSut()

    const video = sut.hoist.debugElement.query(By.css('video')).nativeElement as HTMLVideoElement
    const z = sut.hoist.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement

    // tslint:disable-next-line:no-object-mutation
    video.muted = true
    // tslint:disable-next-line:no-object-mutation
    video.volume = 0

    z.click()

    expect(video.volume).toEqual(1)
    expect(video.muted).toEqual(false)

    expect(sut).toBeTruthy()
  }))

  it('should play through if ok', async(() => {
    const sut = createSut()

    const video = sut.hoist.debugElement.query(By.css('video')).nativeElement as HTMLVideoElement

    spyOn(video, 'play').and.returnValue(Promise.resolve())
  }))
})
