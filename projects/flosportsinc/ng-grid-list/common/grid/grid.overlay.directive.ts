import { ElementRef, Directive } from '@angular/core'

@Directive({
  selector: '[floGridListOverlay]',
})
export class FloGridListOverlayDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}
