import { FloVideoAutoplayDirective } from './ng-video-autoplay.directive'
import { TestBed, async } from '@angular/core/testing'
import {
  FloVideoAutoplayTestModule, createSut, FloVideoAutoplayMultiTestComponent,
  FloVideoAutoplayTestDisabledComponent
} from './ng-video-autoplay.module.spec'
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

  it('should play when play-ref element clicked', async(() => {
    const sut = createSut()
    const video = sut.hoist.debugElement.query(By.css('video')).nativeElement as HTMLVideoElement
    const btns = sut.hoist.debugElement.queryAll(By.css('button')).map(a => a.nativeElement) as ReadonlyArray<HTMLButtonElement>

    sut.hoist.detectChanges()

    // tslint:disable-next-line:no-object-mutation
    video.muted = true
    // tslint:disable-next-line:no-object-mutation
    video.volume = 0
    btns[1].click()

    expect(btns[1].style.display).toEqual('none')
  }))

  it('should play through if ok', async(() => {
    const sut = createSut()

    const video = sut.hoist.debugElement.query(By.css('video')).nativeElement as HTMLVideoElement

    spyOn(video, 'play').and.returnValue(Promise.resolve())
  }))

  it('should compile multi-video autoplay', async(() => {
    const sut = createSut(FloVideoAutoplayMultiTestComponent)
    expect(sut.instance).toBeTruthy()
  }))

  it('should allow disabling', async(() => {
    const sut = createSut(FloVideoAutoplayTestDisabledComponent)
    sut.hoist.detectChanges()

    const video = sut.hoist.debugElement.query(By.css('video')).nativeElement as HTMLVideoElement
    const btns = sut.hoist.debugElement.queryAll(By.css('button')).map(a => a.nativeElement) as ReadonlyArray<HTMLButtonElement>

    // tslint:disable-next-line:no-object-mutation
    video.muted = true
    // tslint:disable-next-line:no-object-mutation
    video.volume = 0

    btns[0].click()
    btns[1].click()

    expect(video.volume).toEqual(0)
    expect(video.muted).toEqual(true)
  }))
})
