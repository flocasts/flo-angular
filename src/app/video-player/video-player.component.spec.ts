import { async, TestBed } from '@angular/core/testing'
import { VideoPlayerComponent } from './video-player.component'

describe(VideoPlayerComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [VideoPlayerComponent],
      declarations: [VideoPlayerComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(TestBed.createComponent(VideoPlayerComponent)).toBeTruthy()
  })
})
