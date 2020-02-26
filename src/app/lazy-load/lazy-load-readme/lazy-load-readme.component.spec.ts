import { async, TestBed } from '@angular/core/testing'

import { LazyLoadReadmeComponent } from './lazy-load-readme.component'

describe('LazyLoadReadmeComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LazyLoadReadmeComponent ]
    })
    .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(LazyLoadReadmeComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
