import { Directive, ContentChildren, AfterContentInit, Input, QueryList } from '@angular/core'

@Directive({
  selector: '[floFetchFillItem]'
})
export class FloFetchFillItemDirective {
  @Input() readonly floFetchFillItem: any
}

@Directive({
  selector: '[floFetchFill]'
})
export class FloFetchFillDirective implements AfterContentInit {
  @ContentChildren(FloFetchFillItemDirective) readonly items: QueryList<FloFetchFillItemDirective>

  ngAfterContentInit() {
    console.log(this.items.toArray())
  }
}
