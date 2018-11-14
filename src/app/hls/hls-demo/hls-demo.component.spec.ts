import { async, TestBed } from '@angular/core/testing'
import { HlsDemoComponent } from './hls-demo.component'
import { SharedTestingModule } from '../../shared.testing.module'
import { HlsModule } from '@flosportsinc/ng-media-source-extensions'

describe('HlsDemoComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, HlsModule],
      declarations: [HlsDemoComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(TestBed.createComponent(HlsDemoComponent).componentInstance).toBeTruthy()
  })
})
