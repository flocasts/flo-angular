import { ComponentFixture, TestBed, async } from '@angular/core/testing'
import { HlsComponent } from './hls.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HlsJsModule } from '@flosportsinc/ng-hls'

describe('HlsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HlsJsModule],
      declarations: [HlsComponent]
    }).compileComponents()
  }))

  it('should create', async(() => {
    const fixture = TestBed.createComponent(HlsComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  }))
})
