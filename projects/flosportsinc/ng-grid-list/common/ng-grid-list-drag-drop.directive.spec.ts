import { Component, NgModule } from '@angular/core'
import { FloGridListDragDropDirective } from './ng-grid-list-drag-drop.directive'
import { TestBed, async } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

@Component({
  selector: 'flo-test-component',
  template: '<div floGridListDragDrop>TEST</div>'
})
class TestComponent { }

@Component({
  selector: 'flo-test-disbaled-component',
  template: '<div [floGridListDragDrop]="false">TEST</div>'
})
class TestDisabledComponent { }

@NgModule({
  declarations: [FloGridListDragDropDirective, TestComponent, TestDisabledComponent]
})
export class FloGridListDragDropDirectiveTestingModule { }


describe(FloGridListDragDropDirective.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FloGridListDragDropDirectiveTestingModule]
    }).compileComponents()
  }))

  it('should allow disabled via input', () => {
    const fixture = TestBed.createComponent(TestDisabledComponent)
    const directiveEl = fixture.debugElement.query(By.directive(FloGridListDragDropDirective))
    const directiveInstance = directiveEl.injector.get(FloGridListDragDropDirective)
    fixture.detectChanges()
    expect(directiveEl).not.toBeNull()
    expect(directiveInstance.floGridListDragDrop).toBe(false)
  })

  it('should', () => {
    const fixture = TestBed.createComponent(TestComponent)
    const directiveEl = fixture.debugElement.query(By.directive(FloGridListDragDropDirective))
    expect(directiveEl).not.toBeNull()
    fixture.detectChanges()
    const directiveInstance = directiveEl.injector.get(FloGridListDragDropDirective)
    expect(directiveInstance.floGridListDragDrop).toBe(true)

  })
})
