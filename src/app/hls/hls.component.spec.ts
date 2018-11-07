import { TestBed, async } from '@angular/core/testing'
import { HlsComponent } from './hls.component'
import { HlsJsModule } from '@flosportsinc/ng-hls'
import { SharedTestingModule } from '../shared.testing.module'

describe('HlsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, HlsJsModule],
      declarations: [HlsComponent]
    }).compileComponents()
  }))

  it('should create', async(() => {
    const fixture = TestBed.createComponent(HlsComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  }))
})
