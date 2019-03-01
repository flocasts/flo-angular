import { async, TestBed } from '@angular/core/testing'
import { AutoplayComponent } from './autoplay.component'
import { SharedTestingModule } from '../shared.testing.module'

describe('AutoplayComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      declarations: [AutoplayComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(AutoplayComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()

    expect(component).toBeTruthy()
  })
})
