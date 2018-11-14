import { async, TestBed } from '@angular/core/testing'
import { HlsReadmeComponent } from './hls-readme.component'
import { SharedTestingModule } from '../../shared.testing.module'

describe('HlsReadmeComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      declarations: [ HlsReadmeComponent ]
    })
    .compileComponents()
  }))

  it('should create', () => {
    expect(TestBed.createComponent(HlsReadmeComponent).componentInstance).toBeTruthy()
  })
})
