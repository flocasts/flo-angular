import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ViewportGridBoxComponent } from './viewport-grid-box.component'

describe(ViewportGridBoxComponent.name, () => {
  let component: ViewportGridBoxComponent<HTMLDivElement>
  let fixture: ComponentFixture<ViewportGridBoxComponent<HTMLDivElement>>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewportGridBoxComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent<ViewportGridBoxComponent<HTMLDivElement>>(ViewportGridBoxComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
