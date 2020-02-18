import {
  Directive,
  Inject,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core'
import { maybe } from 'typescript-monads'
import { ErrorLogFn } from './lazy-load.interface'
import { FLO_LAZY_LOAD_LOG_ERROR } from './lazy-load.tokens'

const DEFAULT_THRESHOLD = 0.0

const identity = <A>(a: A): A => a

/**
 * Lazy load an element by waiting until a trigger element is visible.
 *
 * Leverages IntersectionObservers as a browser-native mechanism for lazily
 * loading DOM content. Once the content is loaded, it will not be unloaded at
 * any point, as the observer will be destroyed. Be aware that this directive
 * doesn't produce a placeholder container for the content. If the content can
 * load in at a position which may move content, a placeholder should be used.
 *
 * This directive may not operate as expected without AOT compilation. It
 * appears that this may not be an issue in Angular 9. Run your development
 * compilation with AOT to ensure that lazy loading occurs when desired.
 *
 * @example
 * <span #loadTrigger></span>
 * <app-expensive-component *floLazyLoad="true; threshold=0.2; trigger=loadTrigger;">
 * </app-expensive-component>
 *
 * @see https://caniuse.com/#search=intersectionobserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
@Directive({
  selector: '[floLazyLoad]'
})
export class FloLazyLoadDirective {
  /**
   * The proportion of the `trigger` element which must be visible to trigger a load.
   *
   * Must be at least 0.0 and at most 1.0 but isn't necessary when using
   * "single-pixel" triggers. It's more useful when trying to load after
   * scrolling some portion of the way through a larger preceding component.
   */
  @Input('floLazyLoadThreshold') public readonly threshold = DEFAULT_THRESHOLD

  /**
   * The trigger element which will cause the load to occur.
   *
   * Remember that this element must be visible on page, otherwise the load will
   * never occur. An existing element can be used, or an arbitrary element can
   * be placed on the page as a trigger. The trigger must *always* be present
   * in the DOM (it cannot target an element with or in \*ngIf or \*ngFor).
   */
  @Input('floLazyLoadTrigger') public readonly trigger: HTMLElement

  /**
   * Enable or disable lazy loading.
   *
   * To support dynamic usage of this directive, a boolean can be passed to
   * enable or disable it. This is useful for a/b testing and checking for
   * browser support if old browsers are a concern. If lazy loading is disabled
   * at any point, then the element will be immediately loaded.
   */
  @Input('floLazyLoad') public set active(enabled: boolean) {
    if (enabled) {
      try {
        // tslint:disable-next-line: no-object-mutation
        this.observer = new IntersectionObserver(
          entries => {
            this.checkForIntersection(entries)
          },
          { threshold: this.cleanThreshold }
        )
        this.observer.observe(this.trigger)
      } catch (e) {
        if (!(e instanceof ReferenceError)) {
          this.logError(e)
        }
        this.loadView()
      }
    } else {
      this.loadView()
    }
  }

  // tslint:disable-next-line:readonly-keyword
  private observer?: IntersectionObserver

  private get cleanThreshold(): number {
    return this.validateThreshold(this.threshold)
  }

  constructor(
    private readonly lazyBoi: TemplateRef<HTMLElement>,
    private readonly viewContainer: ViewContainerRef,
    @Inject(FLO_LAZY_LOAD_LOG_ERROR) private readonly logError: ErrorLogFn
  ) { }

  private loadView() {
    this.viewContainer.createEmbeddedView(this.lazyBoi).detectChanges()
  }

  private isIntersecting(entry: IntersectionObserverEntry): boolean {
    return entry.isIntersecting && entry.target === this.trigger
  }

  private checkForIntersection(
    entries: ReadonlyArray<IntersectionObserverEntry>
  ): void {
    entries.forEach(entry => {
      if (!this.isIntersecting(entry) || this.observer === undefined) {
        return
      }
      // tslint:disable-next-line: no-object-mutation
      this.active = false
      this.observer.unobserve(this.trigger)
      this.observer.disconnect()
    })
  }

  private validateThreshold(val: number): number {
    return maybe(val)
      .filter(a => a >= 0)
      .filter(a => a <= 1)
      .match({
        some: identity,
        none: () => {
          this.logError(
            `Invalid lazy load threshold. Must be from 0.0 to 1.0; defaulting to ${DEFAULT_THRESHOLD}.`
          )
          return DEFAULT_THRESHOLD
        }
      })
  }
}
