import { async, TestBed } from '@angular/core/testing'
import { ViewportGridComponent } from './viewport-grid.component'

describe('WindowFrameComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewportGridComponent]
    }).compileComponents()
  }))

  it('should compile', () => {
    const fixture = TestBed.createComponent(ViewportGridComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
