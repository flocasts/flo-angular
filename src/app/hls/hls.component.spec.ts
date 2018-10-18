import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { HlsComponent } from './hls.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HlsModule } from '@flosportsinc/hls'

describe('HlsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HlsModule],
      declarations: [HlsComponent]
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
