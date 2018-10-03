import { Directive, ElementRef } from '@angular/core'

@Directive({
  selector: '[floWindowPaneItem]'
})
export class WindowPaneItemDirective {
  constructor(public elementRef: ElementRef<WindowPaneItemDirective>) { }
}
