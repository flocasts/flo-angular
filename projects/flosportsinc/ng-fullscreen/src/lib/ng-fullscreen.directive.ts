import { Directive, ContentChild, TemplateRef, ElementRef, HostListener, ViewChild, ViewContainerRef, Input } from '@angular/core'

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
  constructor(public elmRef: ElementRef<TElement>,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
  }

  @Input() floFullscreenOff?: HTMLElement

  ngOnInit() {
    // if 
    this.viewContainer.createEmbeddedView(this.templateRef)
    // console.log(this.floFullscreenOff)
  }
}

@Directive({
  selector: '[floFullscreen]'
})
export class FloFullscreenDirective {
  constructor(elmRef: ElementRef<HTMLElement>) {
  }

  @ViewChild(FloFullscreenOnDirective) readonly fullscreenOnTemplateRef: TemplateRef<HTMLElement>
  @ContentChild(FloFullscreenOffDirective) readonly fullscreenOffTemplateRef: TemplateRef<HTMLElement>

  ngOnInit() {
    console.log(this.fullscreenOffTemplateRef)
    console.log(this.fullscreenOnTemplateRef)
  }

  ngAfterViewInit() {
    console.log(this.fullscreenOffTemplateRef)
    console.log(this.fullscreenOnTemplateRef)
  }
}
