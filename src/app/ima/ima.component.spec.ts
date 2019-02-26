import { async, TestBed } from '@angular/core/testing'
import { ImaComponent } from './ima.component'

describe('ImaComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImaComponent ]
    })
    .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(ImaComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
