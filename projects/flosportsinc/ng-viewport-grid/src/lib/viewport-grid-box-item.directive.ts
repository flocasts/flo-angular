import { Directive, ElementRef, HostBinding, Input } from '@angular/core'
import { shortGuid } from './util'
import { maybe } from 'typescript-monads'

@Directive({
  selector: '[floViewportGridBoxItem]'
})
export class ViewportGridBoxItemDirective<THTMLElement, TMeta = any> {
  constructor(public elementRef: ElementRef<THTMLElement>) { }

  @HostBinding('attr.id') public readonly guid = shortGuid()

  @Input() public readonly floViewportGridBoxItem?: TMeta
  @Input() public readonly floViewportGridBoxItemShowSelectionBox = true
  @Input() public readonly floViewportGridBoxSelectionBoxColor = true

  public readonly maybeFloViewportGridBoxItem = () => maybe(this.floViewportGridBoxItem)
}
