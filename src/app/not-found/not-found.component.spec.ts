import { async, TestBed } from '@angular/core/testing'
import { NotFoundComponent } from './not-found.component'
import { MarkdownModule } from 'ngx-markdown'
import { RouterTestingModule } from '@angular/router/testing'

describe('NotFoundComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MarkdownModule, RouterTestingModule],
      declarations: [NotFoundComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    const component = TestBed.createComponent(NotFoundComponent)
    component.detectChanges()
    expect(component.componentInstance).toBeTruthy()
  })
})
