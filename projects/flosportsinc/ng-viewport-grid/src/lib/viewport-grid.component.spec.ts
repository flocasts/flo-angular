import { async, TestBed } from '@angular/core/testing'
import { ViewportGridComponent } from './viewport-grid.component'
import { Component, NgModule } from '@angular/core'
import { By } from '@angular/platform-browser'
import { ViewportGridBoxItemDirective } from './viewport-grid-box-item.directive'
import { ViewportGridBoxComponent } from './viewport-grid-box.component'
import { CommonModule } from '@angular/common'
import { Subject } from 'rxjs'
import { startWith } from 'rxjs/operators'

const fill = (num: number) => Array(num).fill(0)

@Component({
  selector: 'flo-test-component',
  template: `
  <flo-viewport-grid>
    <flo-viewport-grid-box *ngFor="let item of items$ | async; trackBy: trackByFn">
      <div floViewportGridBoxItem style="color: white; text-align: center;">test</div>
    </flo-viewport-grid-box>
  </flo-viewport-grid>
  `
})
export class TestComponent {
  private readonly itemSource = new Subject<any>()
  readonly items$ = this.itemSource.asObservable().pipe(startWith(fill(4)))
  public readonly setItems = (num: number) => this.itemSource.next(fill(num))
  trackByFn(index) {
    return index
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [
    TestComponent,
    ViewportGridComponent,
    ViewportGridBoxItemDirective,
    ViewportGridBoxComponent
  ],
  exports: [TestComponent]
})
export class TestingModule { }

const createSut = () => {
  const hoist = TestBed.createComponent<TestComponent>(TestComponent)
  hoist.autoDetectChanges()
  const directive = hoist.debugElement.query(By.directive(ViewportGridComponent))
  return {
    hoist,
    directive,
    instance: directive.injector.get<ViewportGridComponent>(ViewportGridComponent)
  }
}

describe(ViewportGridComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents()
  }))

  it('should compile', () => {
    expect(createSut().directive).toBeTruthy()
  })

  it('should get selected element via public function', () => {
    const sut = createSut()
    sut.instance.maybeGetSelectedElementItem()
      .tap({
        none: () => expect(true).toEqual(false),
        some: s => expect(s.tagName).toEqual('DIV')
      })
    sut.instance.maybeGetSelectedElementItems()
      .tap({
        none: () => expect(true).toEqual(false),
        some: s => {
          expect(s.length).toEqual(1)
          expect(s[0].tagName).toEqual('DIV')
        }
      })
    sut.instance.maybeGetSelectedItem()
      .tap({
        none: () => expect(true).toEqual(false),
        some: s => expect(s instanceof ViewportGridBoxComponent).toEqual(true)
      })
  })

  it('should not get selected element via public function when none exist', () => {
    const sut = createSut()
    sut.hoist.componentInstance.setItems(0)
    sut.hoist.detectChanges()
    sut.instance.maybeGetSelectedElementItem()
      .tap({
        none: () => expect(true).toEqual(true),
        some: _ => expect(true).toEqual(false)
      })
  })

  describe('grid with 1 box', () => {
    it('should compiler', () => {
      const sut = createSut()
      sut.hoist.componentInstance.setItems(1)
      sut.hoist.detectChanges()
    })

    it('should not have css-grid styles', () => {
      const sut = createSut()
      sut.hoist.componentInstance.setItems(1)
      sut.hoist.detectChanges()
      const elm = sut.hoist.debugElement.query(By.css('#gridContainer'))
      expect(elm.styles['grid-template-columns']).toBeNull()
      expect(elm.styles['grid-template-rows']).toBeNull()
      expect(elm.styles['max-height']).toBeNull()
    })
  })

  describe('grid with 2 box', () => {
    it('should compiler', () => {
      const sut = createSut()
      sut.hoist.componentInstance.setItems(2)
      sut.hoist.detectChanges()
    })
  })
})
