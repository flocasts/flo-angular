import { async, TestBed } from '@angular/core/testing'
import { ViewportGridBoxComponent } from './viewport-grid-box.component'
import { Component, NgModule } from '@angular/core'
import { By } from '@angular/platform-browser'
import { take } from 'rxjs/operators'

@Component({
  selector: 'flo-test-component',
  template: `
  <flo-viewport-grid-box>
    <div floViewportGridBoxItem></div>
  </flo-viewport-grid-box>
  `
})
export class TestComponent {
}

@NgModule({
  declarations: [TestComponent, ViewportGridBoxComponent],
  exports: [TestComponent]
})
export class TestingModule { }

const createSut = () => {
  const hoist = TestBed.createComponent<TestComponent>(TestComponent)
  hoist.autoDetectChanges()
  const directive = hoist.debugElement.query(By.directive(ViewportGridBoxComponent))
  return {
    hoist,
    directive,
    instance: directive.injector.get<ViewportGridBoxComponent<HTMLDivElement>>(ViewportGridBoxComponent)
  }
}

describe(ViewportGridBoxComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents()
  }))

  it('should compile', () => {
    expect(createSut()).toBeTruthy()
  })

  it('should have guid', () => {
    expect(createSut().instance.guid.length).toEqual(12)
  })

  it('should have guid set on id', () => {
    expect(createSut().directive.nativeElement.id.length).toEqual(12)
  })

  it('should toggle to selected', () => {
    const sut = createSut()
    const instance = sut.instance

    instance.setSelected(false)
    const spy = spyOn(instance, 'setSelected')
    instance.toggleSelected()
    expect(spy).toHaveBeenCalledWith(true)
  })

  it('should toggle to not-selected', () => {
    const sut = createSut()
    const instance = sut.instance

    instance.setSelected(true)
    const spy = spyOn(instance, 'setSelected')
    instance.toggleSelected()
    expect(spy).toHaveBeenCalledWith(false)
  })

  it('should add the border class when selected', () => {
    const sut = createSut()

    sut.instance.setSelected(true)
    const elmsWithClass = sut.directive.queryAll(By.css('div.flo-vp-selected'))
    expect(elmsWithClass.length).toEqual(1)
  })

  it('should remove the border class when selection is lost', () => {
    const sut = createSut()

    sut.instance.setSelected(false)
    const elmsWithClass = sut.directive.queryAll(By.css('div.flo-vp-selected'))
    expect(elmsWithClass.length).toEqual(0)
  })

  it('should emit isSelected$ event when selected', done => {
    const sut = createSut()

    sut.instance.isSelected$.pipe(take(1)).subscribe(evt => {
      expect(evt).toEqual(true)
      done()
    })

    sut.instance.setSelected(true)
  })

  it('should emit isSelected$ event when deselected', done => {
    const sut = createSut()

    sut.instance.isSelected$.pipe(take(1)).subscribe(evt => {
      expect(evt).toEqual(false)
      done()
    })

    sut.instance.setSelected(false)
  })

  it('should pass through click event', done => {
    const sut = createSut()

    sut.instance.clicked$.pipe(take(1)).subscribe(evt => {
      expect(evt instanceof ViewportGridBoxComponent).toEqual(true)
      done()
    })

    const elm = sut.directive.nativeElement as HTMLDivElement
    elm.click()
  })
})
