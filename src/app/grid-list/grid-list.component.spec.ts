import { async, TestBed } from '@angular/core/testing'
import { GridListComponent } from './grid-list.component'
import { FloGridListModule } from '@flosportsinc/ng-grid-list'

describe(GridListComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloGridListModule],
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
