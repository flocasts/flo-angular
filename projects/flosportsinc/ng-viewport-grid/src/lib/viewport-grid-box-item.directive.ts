import { Directive, ElementRef, HostBinding, Input } from '@angular/core'
import { shortGuid } from './util'

@Directive({
  selector: '[floViewportGridBoxItem]'
})
export class ViewportGridBoxItemDirective<THTMLElement> {
  constructor(public elementRef: ElementRef<THTMLElement>) { }
  @HostBinding('attr.id') public readonly guid = shortGuid()
  @Input() public readonly floViewportGridBoxItemShowSelectionBox = true
  @Input() public readonly floViewportGridBoxSelectionBoxColor = true
}
