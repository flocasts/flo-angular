import { async, TestBed } from '@angular/core/testing'
import { HlsDemoComponent } from './hls-demo.component'

describe('HlsDemoComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HlsDemoComponent ]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(TestBed.createComponent(HlsDemoComponent).componentInstance).toBeTruthy()
  })
})
