import { async, TestBed } from '@angular/core/testing'
import { LazyLoadComponent } from './lazy-load.component'

describe('LazyLoadComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LazyLoadComponent]
    })
      .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(LazyLoadComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
