import { async, TestBed } from '@angular/core/testing'
import { FetchFillComponent } from './fetch-fill.component'

describe('FetchFillComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchFillComponent ]
    })
    .compileComponents()
  }))

  it('should create', () => {
    const comp = TestBed.createComponent(FetchFillComponent)
    comp.detectChanges()
    expect(comp).toBeTruthy()
  })
})
