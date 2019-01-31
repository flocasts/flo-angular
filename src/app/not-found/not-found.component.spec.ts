import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NotFoundComponent } from './not-found.component'
import { MarkdownModule } from 'ngx-markdown'

describe('NotFoundComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MarkdownModule],
      declarations: [NotFoundComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(TestBed.createComponent(NotFoundComponent).componentInstance).toBeTruthy()
  })
})
