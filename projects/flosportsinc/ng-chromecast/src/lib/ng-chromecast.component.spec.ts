import { async, TestBed } from '@angular/core/testing'
import { FloChromecastComponent } from './ng-chromecast.component'

describe(FloChromecastComponent.name, () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FloChromecastComponent]
    })
      .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(FloChromecastComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
