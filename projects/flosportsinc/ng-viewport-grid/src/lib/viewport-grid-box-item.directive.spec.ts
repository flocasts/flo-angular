import { async, TestBed } from '@angular/core/testing'
import { ViewportGridBoxItemDirective } from './viewport-grid-box-item.directive'
import { Component, NgModule } from '@angular/core'
import { By } from '@angular/platform-browser'
import { ViewportGridModule } from './viewport-grid.module'

@Component({
  selector: 'flo-test-component',
  template: `<div [floViewportGridBoxItem]="{ test: 1 }"></div>`
})
export class TestComponent { }

@NgModule({
  imports: [ViewportGridModule],
  declarations: [TestComponent],
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

  it('should pass meta object', () => {
    expect(createSut().instance.floViewportGridBoxItem).toEqual({ test: 1 })
  })

  it('should provide maybe wrapper for meta data access', () => {
    expect(createSut().instance.maybeFloViewportGridBoxItem().valueOrUndefined()).toEqual({ test: 1 })
  })
})
