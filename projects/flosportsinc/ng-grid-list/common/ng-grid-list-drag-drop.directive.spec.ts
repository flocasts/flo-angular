import { Component, NgModule } from '@angular/core'
import { FloGridListDragDropDirective } from './ng-grid-list-drag-drop.directive'
import { TestBed, async } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

// tslint:disable: no-object-mutation

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

  // it('should set draggable property when active', () => {
  //   const fixture = TestBed.createComponent(TestDisabledComponent)
  //   const directiveEl = fixture.debugElement.query(By.directive(FloGridListDragDropDirective))
  //   const directiveInstance = directiveEl.injector.get(FloGridListDragDropDirective)
  //   fixture.detectChanges()
  //   expect(directiveEl.nativeElement.draggable).toEqual(true)
  // })

  it('should convert empty string directive to true boolean', () => {
    const fixture = TestBed.createComponent(TestComponent)
    const directiveEl = fixture.debugElement.query(By.directive(FloGridListDragDropDirective))
    expect(directiveEl).not.toBeNull()
    fixture.detectChanges()
    const directiveInstance = directiveEl.injector.get(FloGridListDragDropDirective)
    expect(directiveInstance.floGridListDragDrop).toBe(true)
  })

  it('should handle dragover events', () => {
    const fixture = TestBed.createComponent(TestComponent)
    const directiveEl = fixture.debugElement.query(By.directive(FloGridListDragDropDirective))
    const evt = new DragEvent('dragover')
    const spyEvent = spyOn(evt, 'preventDefault')
    directiveEl.triggerEventHandler('dragover', evt)
    expect(spyEvent).toHaveBeenCalled()
  })

  it('should handle dragstart events', () => {
    const fixture = TestBed.createComponent(TestComponent)
    const directiveEl = fixture.debugElement.query(By.directive(FloGridListDragDropDirective))
    const directiveInstance = directiveEl.injector.get(FloGridListDragDropDirective)
    directiveInstance.floGridListDragDropIndex = 4
    directiveInstance.floGridListDragDropItem = { id: '2', some: 'thing' } as any
    const dataTransfer = new DataTransfer()
    const evt = new DragEvent('dragstart', { dataTransfer })
    directiveEl.triggerEventHandler('dragstart', evt)
    expect(dataTransfer.getData('text')).toEqual('{"index":4,"value":{"id":"2","some":"thing"}}')
    expect(JSON.parse(dataTransfer.getData('text'))).toEqual({ index: 4, value: { id: '2', some: 'thing' } })
  })

  describe('drop', () => {
    it('should handle nominal case', () => {
      const fixture = TestBed.createComponent(TestComponent)
      const directiveEl = fixture.debugElement.query(By.directive(FloGridListDragDropDirective))
      const directiveInstance = directiveEl.injector.get(FloGridListDragDropDirective)
      directiveInstance.floGridListDragDropIndex = 3
      directiveInstance.floGridListDragDropItem = { id: '2', some: 'thing' } as any
      directiveInstance.floGridListDragDropGridRef = { swapItemsAtIndex: () => { }, isItemInGrid: () => {} } as any
      const dataTransfer = new DataTransfer()
      dataTransfer.setData('text', JSON.stringify({ index: 4, value: { id: '2', some: 'thing' } }))
      const evt = new DragEvent('drop', { dataTransfer })
      directiveEl.triggerEventHandler('drop', evt)
    })
  })
})
