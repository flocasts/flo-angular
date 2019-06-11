import { async, TestBed } from '@angular/core/testing'
import { GridListComponent } from './grid-list.component'
import { FloGridListModule } from '@flosportsinc/ng-grid-list'
import { By } from '@angular/platform-browser';

describe(GridListComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloGridListModule],
      declarations: [GridListComponent]
    }).compileComponents()
  }))


  it('should create', () => {
    const fixture = TestBed.createComponent(GridListComponent)
    fixture.detectChanges()
    expect(fixture.componentInstance).toBeTruthy()
  })

  it('should ready for fullscreen click', () => {
    const fixture = TestBed.createComponent(GridListComponent)
    fixture.detectChanges()
    const elm = fixture.debugElement.query(By.css('#fullscreen')).nativeElement
    elm.click()
    expect(elm).toBeTruthy()
  })
})
