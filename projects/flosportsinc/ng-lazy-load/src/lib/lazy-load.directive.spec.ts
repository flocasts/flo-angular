import { Component, Input } from '@angular/core'
import { FloLazyLoadDirective } from './lazy-load.directive'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { FLO_LAZY_LOAD_LOG_ERROR } from './lazy-load.tokens'
import createSpy = jasmine.createSpy

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  template: `
    <div style="min-height: 1500px"></div>
    <div #trigger style="min-height: 500px"></div>
    <div
      data-test="lazy-boi"
      *floLazyLoad="lazyLoad; trigger: trigger; threshold: 0.0"
    >
      loaded
    </div>
  `
})
class LazyBoiComponent {
  // tslint:disable-next-line:readonly-keyword
  @Input() public lazyLoad: boolean
}

describe(FloLazyLoadDirective.name, () => {
  // tslint:disable-next-line:no-let
  let fixture: ComponentFixture<LazyBoiComponent>
  // tslint:disable-next-line:no-let
  let component: LazyBoiComponent

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloLazyLoadDirective, LazyBoiComponent],
      providers: [
        // tslint:disable-next-line:no-console
        { provide: FLO_LAZY_LOAD_LOG_ERROR, useValue: createSpy('errorLogFn', console.error) }
      ]
    })

    fixture = TestBed.createComponent(LazyBoiComponent)
    component = fixture.componentInstance
  })

  it('can disable lazy loading programmatically', () => {
    component.lazyLoad = false
    fixture.detectChanges()
    const el = fixture.debugElement.query(By.css('[data-test="lazy-boi"]'))
      .nativeElement as HTMLDivElement

    expect(el.innerHTML.trim()).toBe('loaded')
  })

  it('does not throw an error when IntersectionObserver is not supported', () => {
    /*
    IntersectionObserver isn't supported by the Jest DOM so if lazyLoad is set
    to true in a jest test, we can expect that an error would be thrown if this
    case wasn't handled.
     */
    component.lazyLoad = true
    fixture.detectChanges()
    const errorLogFn = TestBed.get(FLO_LAZY_LOAD_LOG_ERROR)
    const el = fixture.debugElement.query(By.css('[data-test="lazy-boi"]'))
      .nativeElement as HTMLDivElement

    expect(el.innerHTML.trim()).toBe('loaded')
    expect(errorLogFn).toHaveBeenCalledTimes(0)
  })
})
