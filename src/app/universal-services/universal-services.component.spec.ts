import { async, TestBed } from '@angular/core/testing'
import { UniversalServicesComponent } from './universal-services.component'
import { SharedTestingModule } from '../shared.testing.module'

describe(UniversalServicesComponent.name, () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      declarations: [UniversalServicesComponent]
    }).compileComponents()
  }))

  it('should create', () => {
    expect(TestBed.createComponent(UniversalServicesComponent)).toBeTruthy()
  })
})
