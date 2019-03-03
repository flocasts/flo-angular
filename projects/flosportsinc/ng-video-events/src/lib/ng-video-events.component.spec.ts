import { async, TestBed } from '@angular/core/testing'
import { NgVideoEventsComponent } from './ng-video-events.component'

describe('NgVideoEventsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgVideoEventsComponent]
    })
      .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(NgVideoEventsComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()

    expect(component).toBeTruthy()
  })
})
