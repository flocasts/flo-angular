import {
  Directive, ContentChildren, AfterContentInit, Input, QueryList,
  Inject, Optional, TemplateRef, ViewContainerRef, ChangeDetectorRef
} from '@angular/core'
import { LOADERS, ILoader } from './ng-fetch-fill.tokens'
import { IResult } from 'typescript-monads'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation
// tslint:disable: no-input-rename
// tslint:disable: readonly-array
// tslint:disable: no-if-statement

@Directive({
  selector: '[floFetchFillItem]'
})
export class FloFetchFillItemDirective<TItem> {
  constructor(private tr: TemplateRef<any>, private vc: ViewContainerRef, private cd: ChangeDetectorRef) { }

  private _outputKey: string

  @Input('floFetchFillItemOf') readonly input: TItem
  @Input('floFetchFillItemUsingOutputKey')
  get outputKey () {
    return this._outputKey
  }
  set outputKey(val: Object) {
    this._outputKey = val.toString()
  }

  setResponse(res: IResult<TItem, TItem>) {
    if (res.isOk()) {
      this.vc.createEmbeddedView(this.tr, {
        $implicit: res.unwrap()
      })
    } else {
      this.vc.clear()
    }

    this.cd.detectChanges()
  }
}

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
