import { async, TestBed } from '@angular/core/testing'

import { LazyLoadDemoComponent } from './lazy-load-demo.component'
import { FloLazyLoadDirective } from '@flosportsinc/ng-lazy-load'

describe('LazyLoadDemoComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LazyLoadDemoComponent, FloLazyLoadDirective ]
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
