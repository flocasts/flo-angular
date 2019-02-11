import { async, TestBed } from '@angular/core/testing'
import { StylesComponent } from './styles.component'
import { SharedTestingModule } from '../shared.testing.module'

describe(StylesComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      declarations: [StylesComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(StylesComponent)
    fixture.detectChanges()
    expect(fixture.componentInstance).toBeTruthy()
  })
})
