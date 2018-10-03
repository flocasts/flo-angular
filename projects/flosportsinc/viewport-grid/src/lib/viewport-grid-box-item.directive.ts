import { Directive, ElementRef } from '@angular/core'

@Directive({
  selector: '[floViewportGridBoxItem]'
})
export class ViewportGridBoxItemDirective {
  constructor(public elementRef: ElementRef<ViewportGridBoxItemDirective>) { }
}
