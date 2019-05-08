import { async, TestBed } from '@angular/core/testing'
import { GridListComponent } from './grid-list.component'

describe(GridListComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GridListComponent]
    })
      .compileComponents()
  }))


  it('should create', () => {
    const fixture = TestBed.createComponent(GridListComponent)
    fixture.detectChanges()
    expect(fixture.componentInstance).toBeTruthy()
  })
})
