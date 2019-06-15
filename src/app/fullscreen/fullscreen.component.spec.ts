import { async, TestBed } from '@angular/core/testing'
import { FullscreenComponent } from './fullscreen.component'

describe('FullscreenComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FullscreenComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(TestBed.createComponent(FullscreenComponent)).toBeTruthy()
  })
})
