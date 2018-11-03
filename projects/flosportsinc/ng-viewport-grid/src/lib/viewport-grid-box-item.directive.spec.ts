import { async, TestBed } from '@angular/core/testing'
import { ViewportGridBoxItemDirective } from './viewport-grid-box-item.directive'
import { Component, NgModule } from '@angular/core'
import { By } from '@angular/platform-browser'

@Component({
  selector: 'flo-test-component',
  template: `
  <div
    floViewportGridBoxItem>
  </div>`
})
export class TestComponent {
  // tslint:disable-next-line:readonly-keyword
  // @Input() public src?: string = TEST_SRC
}

@NgModule({
  declarations: [TestComponent, ViewportGridBoxItemDirective],
  exports: [TestComponent]
})
export class TestingModule { }

const createSut = () => {
  const hoist = TestBed.createComponent(TestComponent)
  hoist.autoDetectChanges()
  const directive = hoist.debugElement.query(By.directive(ViewportGridBoxItemDirective))
  return {
    hoist,
    directive,
    instance: directive.injector.get(ViewportGridBoxItemDirective)
  }
}

describe(ViewportGridBoxItemDirective.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents()
  }))

  it('should compile', () => {
    expect(createSut().directive).toBeTruthy()
  })

  it('should have guid', () => {
    expect(createSut().instance.guid.length).toEqual(12)
  })

  it('should assign guid to element id', () => {
    expect(createSut().directive.nativeElement.id.length).toEqual(12)
  })
})
