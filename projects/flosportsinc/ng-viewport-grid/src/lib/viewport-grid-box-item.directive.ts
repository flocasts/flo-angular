import { Directive, ElementRef, HostBinding } from '@angular/core'
import { shortGuid } from './util'

@Directive({
  selector: '[floViewportGridBoxItem]'
})
export class ViewportGridBoxItemDirective {
  constructor(public elementRef: ElementRef<ViewportGridBoxItemDirective>) { }
  @HostBinding('attr.id') public readonly guid = shortGuid()
}
