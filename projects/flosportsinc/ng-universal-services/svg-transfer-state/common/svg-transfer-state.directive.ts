import { Directive, ElementRef, Input, OnInit, Inject } from '@angular/core'
import { take } from 'rxjs/operators'
import { SVG_LOADER } from './svg-transfer-state.tokens'
import { ISvgLoaderService } from './svg-transfer-state.interfaces'

// tslint:disable:no-object-mutation
const insertSvg =
  (el: HTMLElement) =>
    (svg: string) =>
      el.innerHTML = svg

@Directive({
  selector: '[floSvg]'
})
export class SvgTransferStateDirective implements OnInit {
  @Input() readonly floSvg: string

  constructor(private _el: ElementRef, @Inject(SVG_LOADER) private _svgLoader: ISvgLoaderService) { }

  ngOnInit() {
    this._svgLoader
      .load(this.floSvg)
      .pipe(take(1))
      .subscribe(insertSvg(this._el.nativeElement))
  }
}
