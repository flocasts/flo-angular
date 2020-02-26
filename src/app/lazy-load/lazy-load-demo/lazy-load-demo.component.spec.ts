import { async, TestBed } from '@angular/core/testing'

import { LazyLoadDemoComponent } from './lazy-load-demo.component'

describe('LazyLoadDemoComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LazyLoadDemoComponent ]
    })
    .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(LazyLoadDemoComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
