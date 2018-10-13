import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ViewportGridComponent } from './viewport-grid.component'

describe('WindowFrameComponent', () => {
  let component: ViewportGridComponent
  let fixture: ComponentFixture<ViewportGridComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportGridComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportGridComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
