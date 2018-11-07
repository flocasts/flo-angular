import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NotFoundComponent } from './not-found.component'

describe('NotFoundComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotFoundComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(TestBed.createComponent(NotFoundComponent).componentInstance).toBeTruthy()
  })
})
