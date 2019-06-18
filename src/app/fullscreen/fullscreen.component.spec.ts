import { async, TestBed } from '@angular/core/testing'
import { FullscreenComponent } from './fullscreen.component'
import { FloFullscreenModule } from 'projects/flosportsinc/ng-fullscreen/src/ng-fullscreen.module'

describe('FullscreenComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloFullscreenModule],
      declarations: [FullscreenComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(TestBed.createComponent(FullscreenComponent)).toBeTruthy()
  })
})
