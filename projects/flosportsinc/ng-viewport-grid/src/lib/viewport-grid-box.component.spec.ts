import { async, TestBed } from '@angular/core/testing'
import { ViewportGridBoxComponent } from './viewport-grid-box.component'

const createSut = () => {
  const hoist = TestBed.createComponent<ViewportGridBoxComponent<HTMLDivElement>>(ViewportGridBoxComponent)
  hoist.autoDetectChanges()
  return hoist
}

describe(ViewportGridBoxComponent.name, () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewportGridBoxComponent]
    }).compileComponents()
  }))

  it('should compile', () => {
    expect(createSut()).toBeTruthy()
  })

  it('should have guid', () => {
    expect(createSut().componentInstance.guid.length).toEqual(12)
  })

  it('should have guid set on id', () => {
    expect(createSut().nativeElement.id.length).toEqual(12)
  })

  it('should toggle to selected', () => {
    const sut = createSut()
    const instance = sut.componentInstance

    instance.setSelected(false)
    const spy = spyOn(instance, 'setSelected')
    instance.toggleSelected()
    expect(spy).toHaveBeenCalledWith(true)
  })

  it('should toggle to not-selected', () => {
    const sut = createSut()
    const instance = sut.componentInstance

    instance.setSelected(true)
    const spy = spyOn(instance, 'setSelected')
    instance.toggleSelected()
    expect(spy).toHaveBeenCalledWith(false)
  })

  it('should add the border class when selected', () => {
    const sut = createSut()
    const instance = sut.componentInstance

    const spy = spyOn(instance, 'setSelected')
    // instance()
  })

  it('should remove the border class when selection is lost', () => {
    const sut = createSut()
    const instance = sut.componentInstance

    const spy = spyOn(instance, 'setSelected')
    // instance()
  })
})
