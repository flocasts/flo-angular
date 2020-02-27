import { async, TestBed } from '@angular/core/testing'

import { LazyLoadReadmeComponent } from './lazy-load-readme.component'
import { SharedTestingModule } from '../../shared.testing.module'

describe('LazyLoadReadmeComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedTestingModule ],
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
