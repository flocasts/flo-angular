import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { GridListComponent } from './grid-list.component'

describe('GridListComponent', () => {
  let component: GridListComponent
  let fixture: ComponentFixture<GridListComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridListComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GridListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
