import { IResult } from 'typescript-monads'
import { Directive, TemplateRef, ViewContainerRef, ChangeDetectorRef, Input } from '@angular/core'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

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
