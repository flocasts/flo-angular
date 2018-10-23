import { async, TestBed } from '@angular/core/testing'
import { ViewportGridBoxComponent } from './viewport-grid-box.component'

describe(ViewportGridBoxComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewportGridBoxComponent]
    })
      .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent<ViewportGridBoxComponent<HTMLDivElement>>(ViewportGridBoxComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
