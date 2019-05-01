import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FloGridTilesComponent } from './grid-tiles.component'

describe('GridTilesComponent', () => {
  let component: FloGridTilesComponent
  let fixture: ComponentFixture<FloGridTilesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FloGridTilesComponent]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FloGridTilesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
