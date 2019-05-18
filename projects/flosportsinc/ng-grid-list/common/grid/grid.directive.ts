import { ElementRef, Directive } from '@angular/core'

@Directive({
  selector: '[floGridListOverlay]',
})
export class FloGridListOverlayDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}

@Directive({
  selector: '[floGridListItemSome]'
})
export class FloGridListItemSomeDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}

@Directive({
  selector: '[floGridListItemNone]',
})
export class FloGridListItemNoneDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}
