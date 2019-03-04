import { async, TestBed } from '@angular/core/testing'
import { NgChromecastComponent } from './ng-chromecast.component'

describe('NgChromecastComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgChromecastComponent]
    })
      .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(NgChromecastComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
