import { async, TestBed } from '@angular/core/testing'
import { ViewportGridComponent, compareWrappedGuids, compareGuids } from './viewport-grid.component'
import { Component, NgModule } from '@angular/core'
import { By } from '@angular/platform-browser'
import { ViewportGridBoxComponent } from './viewport-grid-box.component'
import { Subject } from 'rxjs'
import { startWith } from 'rxjs/operators'
import { SharedTestingModule } from './test.module'

const fill = (num: number) => Array(num).fill(0)

@Component({
  selector: 'flo-base-test-component',
  template: ``
})
export class BaseTestComponent {
  constructor() { }
  // tslint:disable-next-line:readonly-keyword
  public maxHeight = 400
  // tslint:disable-next-line:readonly-keyword
  public startingSelectedIndex = 0
  public readonly itemSource = new Subject<any>()
  public readonly iter = (num: number) => this.itemSource.next(fill(num))
  public readonly items$ = this.itemSource.asObservable().pipe(startWith(fill(4)))
  public readonly setItems = (num: number) => this.itemSource.next(fill(num))
  trackByFn(index) {
    return index
  }
}

const template = `
<flo-viewport-grid [maxHeight]="maxHeight" [startingSelectedIndex]="startingSelectedIndex">
  <flo-viewport-grid-box *ngFor="let item of items$ | async; trackBy: trackByFn">
    <div floViewportGridBoxItem style="color: white; text-align: center;">test</div>
  </flo-viewport-grid-box>
</flo-viewport-grid>
`

@Component({
  selector: 'flo-test-component',
  template
})
export class TestComponent extends BaseTestComponent { }

@Component({
  selector: 'flo-test-component-20',
  template
})
export class TestStartIndex20Component extends BaseTestComponent {
  constructor() {
    super()
    this.startingSelectedIndex = 20
  }
}

@Component({
  selector: 'flo-test-component-1',
  template
})
export class TestStartIndex1Component extends BaseTestComponent {
  constructor() {
    super()
    this.startingSelectedIndex = 1
  }
}

@NgModule({
  imports: [SharedTestingModule],
  declarations: [
    BaseTestComponent,
    TestComponent,
    TestStartIndex1Component,
    TestStartIndex20Component
  ],
  exports: [BaseTestComponent, TestComponent, TestStartIndex1Component, TestStartIndex20Component]
})
export class TestingModule { }

const createSut = (comp: any = TestComponent) => {
  const hoist = TestBed.createComponent<TestComponent>(comp)
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

  it('should re-apply internal styles when OnChanges', () => {
    const sut = createSut()
    const spy = spyOn(sut.instance as any, '_setGridStyles')
    // tslint:disable-next-line:no-object-mutation
    sut.hoist.componentInstance.maxHeight = 500
    sut.hoist.detectChanges()
    expect(spy).toHaveBeenCalled()
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

  it('should switch selecetions', () => {
    const sut = createSut()
    sut.hoist.componentInstance.setItems(6)
    sut.hoist.detectChanges()
    const thirdBox = sut.directive.children[0].children[2]
    thirdBox.nativeElement.click()
    sut.instance.maybeGetSelectedItem()
      .tap({
        some: a => expect(a.guid).toEqual(thirdBox.nativeElement.id),
        none: () => expect(true).toEqual(false)
      })
  })

  it('should always have a selection', () => {
    const sut = createSut()
    Array.from(sut.directive.children[0].children).map(a => a.componentInstance)
      .forEach((a: ViewportGridBoxComponent) => a.setSelected(false))
    sut.hoist.componentInstance.setItems(1)
    sut.hoist.detectChanges()
    const root = sut.directive.children[0].children[0].componentInstance as ViewportGridBoxComponent
    expect(root.isSelected()).toEqual(true)
  })

  it('should start with correct box selection', () => {
    const sut = createSut(TestStartIndex1Component)
    sut.hoist.detectChanges()
    const d = sut.directive.children[0].children[1].componentInstance as ViewportGridBoxComponent
    expect(d.isSelected()).toEqual(true)
  })

  it('should default to 0 index if forced index is greater than total gridBoxes', () => {
    const sut = createSut(TestStartIndex20Component)
    sut.hoist.detectChanges()
    const d = sut.directive.children[0].children[0].componentInstance as ViewportGridBoxComponent
    expect(d.isSelected()).toEqual(true)
  })

  it('should compare guids', () => {
    const res1a = compareWrappedGuids({ selectedViewport: { guid: '123' } } as any, { selectedViewport: { guid: '123' } } as any)
    const res1b = compareGuids({ selectedViewportElementGuid: '123' } as any, { selectedViewportElementGuid: '123' } as any)
    expect(res1a).toEqual(true)
    expect(res1b).toEqual(true)

    const res2a = compareWrappedGuids({ selectedViewport: { guid: 'abc' } } as any, { selectedViewport: { guid: '123' } } as any)
    const res2b = compareGuids({ selectedViewportElementGuid: 'abc' } as any, { selectedViewportElementGuid: '123' } as any)
    expect(res2a).toEqual(false)
    expect(res2b).toEqual(false)
  })
})
