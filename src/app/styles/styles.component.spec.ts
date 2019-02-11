import { async, TestBed } from '@angular/core/testing'
import { StylesComponent } from './styles.component'

describe(StylesComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StylesComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(StylesComponent)
    fixture.detectChanges()
    expect(fixture.componentInstance).toBeTruthy()
  })
})
