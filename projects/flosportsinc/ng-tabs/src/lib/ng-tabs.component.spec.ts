import { async, TestBed } from '@angular/core/testing'
import { NgTabsComponent } from './ng-tabs.component'

describe(NgTabsComponent.name, () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgTabsComponent]
    })
      .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(NgTabsComponent)
    const component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
