import { Directive, ContentChildren, AfterContentInit, Input, QueryList, Inject, Optional, OnDestroy } from '@angular/core'
import { LOADERS, ILoader } from './ng-fetch-fill.tokens'
import { FloFetchFillItemDirective } from './ng-fetch-fill-item.directive'
import { filter, map, takeUntil, flatMap } from 'rxjs/operators'
import { Subject } from 'rxjs'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
// tslint:disable: readonly-array

type Query<TInItem, TOutItem> = QueryList<FloFetchFillItemDirective<TInItem, TOutItem>>

@Directive({
  selector: '[floFetchFill]'
})
export class FloFetchFillDirective<TInItem, TOutItem, TInError, TOutError> implements AfterContentInit, OnDestroy {
  constructor(@Optional() @Inject(LOADERS) private _loaders: ILoader<TInItem, TOutItem, TInError, TOutError>[]) { }

  private ngOnDestroy$ = new Subject()

  get loaders() {
    return this._loaders || []
  }

  @Input() readonly floFetchFill?: string
  @ContentChildren(FloFetchFillItemDirective) readonly fillItems: Query<TInItem, TOutItem>

  ngAfterContentInit() {
    const loader = this.loaders.find(b => b.key === this.floFetchFill)

    if (!loader) { return }

    this.fillItems.changes.pipe(
      map((a: Query<TInItem, TOutItem>) => a.toArray()),
      takeUntil(this.ngOnDestroy$),
      flatMap(items => loader.func(items.map(a => a.input)).pipe(
        filter(b => b.isOk()),
        map(b => b.unwrap()))),
      map(results => Object
        .keys(results)
        .reduce((acc, key) => {
          const directive = this.fillItems.find(a => a.outputKey === key)
          return directive ? [...acc, { directive, item: results[key] }] : acc
        }, [])))
      .subscribe(results => {
        results.forEach(r => r.directive.setResponse(r.item))
      })

    this.fillItems.notifyOnChanges()
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next()
    this.ngOnDestroy$.complete()
  }
}
