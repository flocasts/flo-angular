import { Component, Input } from '@angular/core'
import { FloLazyLoadDirective } from './lazy-load.directive'
import { TestBed } from '@angular/core/testing'
import { FloLazyLoadModule } from './lazy-load.module'
import { NgModule } from '@angular/core'
import { By } from '@angular/platform-browser'
import { FLO_LAZY_LOAD_LOG_ERROR } from './lazy-load.tokens'

@Component({
  selector: 'flo-test-lazy-boi',
  template: `
    <div style="min-height: 1500px"></div>
    <div #trigger style="min-height: 500px"></div>
    <div data-test="lazy-boi" *floLazyLoad="lazyLoad; trigger: trigger; threshold: 0.0">
      loaded
    </div>
  `
})
class LazyBoiComponent {
  // tslint:disable: no-object-mutation
  // tslint:disable:readonly-keyword
  @Input() public lazyLoad = false
}

@NgModule({
  imports: [FloLazyLoadModule],
  declarations: [LazyBoiComponent]
})
export class FloLazyLoadTestModule { }


describe(FloLazyLoadDirective.name, () => {
  beforeEach(done => {
    TestBed.configureTestingModule({
      imports: [FloLazyLoadTestModule]
    })
      .compileComponents()
      .then(done)
  })

  it('should compile', () => {
    const fixture = TestBed.createComponent(LazyBoiComponent)
    const component = fixture.componentInstance

    expect(component).toBeTruthy()
  })

  it('can disable lazy loading programmatically', () => {
    const fixture = TestBed.createComponent(LazyBoiComponent)
    const component = fixture.componentInstance
    component.lazyLoad = false
    fixture.detectChanges()
    const el = fixture.debugElement.query(By.css('[data-test="lazy-boi"]')).nativeElement as HTMLDivElement

    expect(el.innerHTML.trim()).toBe('loaded')
  })

  // it('does not throw an error when IntersectionObserver is not supported', () => {
  //   const fixture = TestBed.createComponent(LazyBoiComponent)
  //   const component = fixture.componentInstance
  //   /*
  //   IntersectionObserver isn't supported by the Jest DOM so if lazyLoad is set
  //   to true in a jest test, we can expect that an error would be thrown if this
  //   case wasn't handled.
  //    */
  //   // tslint:disable: no-object-mutation

  //   // function noop() { }


  //   component.lazyLoad = true
  //   fixture.detectChanges()
  //   // const errorLogFn = TestBed.get(FLO_LAZY_LOAD_LOG_ERROR, noop)
  //   // const spy = spyOnAllFunctions(errorLogFn)
  //   const el = fixture.debugElement.query(By.css('[data-test="lazy-boi"]')).nativeElement as HTMLDivElement

  //   expect(el.innerHTML.trim()).toBe('loaded')
  //   // expect(spy).not.toHaveBeenCalled()
  // })
})
