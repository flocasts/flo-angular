import { Component, NgModule } from '@angular/core'
import { FloGridListDragDropDirective } from './ng-grid-list-drag-drop.directive'
import { TestBed, async } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { FloGridListModule } from './ng-grid-list.module'
import { FloGridListViewComponent } from './grid/grid.component'

// tslint:disable: no-object-mutation

@Component({
  selector: 'flo-test-component',
  template: '<flo-grid-list-view #gridRef></flo-grid-list-view><div floGridListDragDrop [floGridListDragDropGridRef]="gridRef">TEST</div>'
})
class TestComponent { }

@Component({
  selector: 'flo-test-disbaled-component',
  template: '<div [floGridListDragDrop]="false">TEST</div>'
})
class TestDisabledComponent { }

@NgModule({
  imports: [FloGridListModule],
  declarations: [TestComponent, TestDisabledComponent]
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
    it('should handle swap case', () => {
      const fixture = TestBed.createComponent(TestComponent)
      fixture.detectChanges()
      const gridDebug = fixture.debugElement.query(By.directive(FloGridListViewComponent))
      const gridNativeEl = gridDebug.nativeElement as HTMLDivElement
      const gridComponent = gridDebug.componentInstance as FloGridListViewComponent<any>
      const directiveEl = fixture.debugElement.query(By.directive(FloGridListDragDropDirective))
      const directiveInstance = directiveEl.injector.get(FloGridListDragDropDirective)
      directiveInstance.floGridListDragDropIndex = 3
      directiveInstance.floGridListDragDropItem = { id: '2', some: 'thing' } as any

      const spy = spyOn(gridComponent, 'swapItemsAtIndex').and.callThrough()

      const dataTransfer = new DataTransfer()
      dataTransfer.setData('text', JSON.stringify({ index: 4, value: directiveInstance.floGridListDragDropItem }))
      const evt = new DragEvent('drop', { dataTransfer, relatedTarget: gridNativeEl  })
      directiveEl.triggerEventHandler('drop', evt)

      expect(spy).toHaveBeenCalledWith(3, directiveInstance.floGridListDragDropItem, 4)
    })

    it('should handle replace case', () => {
      const fixture = TestBed.createComponent(TestComponent)
      const gridDebug = fixture.debugElement.query(By.directive(FloGridListViewComponent))
      const gridNativeEl = gridDebug.nativeElement as HTMLDivElement
      const gridComponent = gridDebug.componentInstance as FloGridListViewComponent<any>
      gridComponent.items = [{ id: '2', some: 'thing' }]
      fixture.detectChanges()
      const directiveEl = fixture.debugElement.query(By.directive(FloGridListDragDropDirective))
      const directiveInstance = directiveEl.injector.get(FloGridListDragDropDirective)
      directiveInstance.floGridListDragDropIndex = 3
      directiveInstance.floGridListDragDropItem = { id: '2', some: 'thing' } as any

      const spy = spyOn(gridComponent, 'swapItems').and.callThrough()

      const dataTransfer = new DataTransfer()
      dataTransfer.setData('text', JSON.stringify({ index: 4, value: directiveInstance.floGridListDragDropItem }))
      const evt = new DragEvent('drop', { dataTransfer, relatedTarget: gridNativeEl  })
      directiveEl.triggerEventHandler('drop', evt)

      expect(spy).toHaveBeenCalledWith(directiveInstance.floGridListDragDropItem, 3)
    })
  })
})
