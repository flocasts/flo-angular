import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { HlsComponent } from './hls.component'

describe('HlsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HlsComponent ]
    })
    .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(HlsComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
