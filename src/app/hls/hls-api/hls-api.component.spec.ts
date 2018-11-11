import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { HlsApiComponent } from './hls-api.component'
import { SharedTestingModule } from '../../shared.testing.module'

describe(HlsApiComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      declarations: [HlsApiComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(TestBed.createComponent(HlsApiComponent).componentInstance).toBeTruthy()
  })
})
