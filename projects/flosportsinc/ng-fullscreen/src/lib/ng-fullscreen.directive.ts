import { Directive, ContentChild, TemplateRef, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[floFullscreenOn]',
})
export class FloFullscreenOnDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}

@Directive({
  selector: '[floFullscreenOff]',
})
export class FloFullscreenOffDirective<TElement extends HTMLElement> {
  constructor(public elmRef: ElementRef<TElement>) { }
}

@Directive({
  selector: '[floFullscreen]'
})
export class FloFullscreenDirective {

  @ContentChild(FloFullscreenOnDirective, { read: TemplateRef }) readonly fullscreenOnTemplateRef: TemplateRef<HTMLElement>
  @ContentChild(FloFullscreenOffDirective, { read: TemplateRef }) readonly fullscreenOffTemplateRef: TemplateRef<HTMLElement>
}
