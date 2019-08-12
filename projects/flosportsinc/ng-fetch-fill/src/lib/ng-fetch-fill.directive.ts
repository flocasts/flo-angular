import { Directive, ContentChildren, AfterContentInit, Input, QueryList, Inject, Optional } from '@angular/core'
import { LOADERS, ILoader } from './ng-fetch-fill.tokens'
import { FloFetchFillItemDirective } from './ng-fetch-fill-item.directive'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
// tslint:disable: readonly-array

@Directive({
  selector: '[floFetchFill]'
})
export class FloFetchFillDirective<TItem> implements AfterContentInit {
  constructor(@Optional() @Inject(LOADERS) private _loaders: ILoader<TItem>[]) { }

  get loaders() {
    return this._loaders || []
  }

  @Input() readonly floFetchFill?: string
  @ContentChildren(FloFetchFillItemDirective) readonly items: QueryList<FloFetchFillItemDirective<TItem>>

  ngAfterContentInit() {
    const loader = this.loaders.find(b => b.key === this.floFetchFill)

    if (loader) {
      const items = this.items.toArray().map(a => a.input)
      loader.func(items)
        .subscribe(resposne => {
          Object.keys(resposne).forEach(k => {
           const z = this.items.find(a => a.outputKey === k)
           if (z) {
            //  console.log(z)
             // tslint:disable-next-line: no-object-mutation
             z.setResponse(resposne[k])
           }
          })
        })
    }
  }
}
