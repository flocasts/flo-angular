import { Directive, ElementRef, Input } from '@angular/core'

@Directive({
  selector: 'video[floIma]'
})
export class FloImaDirective {
  constructor(public elementRef: ElementRef<HTMLVideoElement>) { }

  @Input() public readonly floIma?: any
}
