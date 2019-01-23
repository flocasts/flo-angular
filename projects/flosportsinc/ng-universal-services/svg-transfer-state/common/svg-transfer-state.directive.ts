import { Directive, ElementRef, Input, OnInit, Inject, Renderer2 } from '@angular/core'
import { SVG_LOADER, SVG_DIRECTIVE_DEFAULT_STYLES, SVG_DIRECTIVE_PARENT_STYLE_KEYS } from './svg-transfer-state.tokens'
import { ISvgLoaderService } from './svg-transfer-state.interfaces'
import { take, filter } from 'rxjs/operators'

// tslint:disable:no-object-mutation
const insertSvg =
  (el: HTMLElement) =>
    (svg: string) =>
      el.innerHTML = svg

const setStyle =
  (rd: Renderer2) =>
    (collection: Object) =>
      (keys: ReadonlyArray<string>) =>
        (elm: Element) =>
          keys.forEach(propKey => rd.setStyle(elm, propKey, collection[propKey]))

@Directive({
  selector: '[floSvg]'
})
export class SvgTransferStateDirective implements OnInit {
  @Input() readonly floSvg: string
  @Input() readonly floSvgStyles = {}

  constructor(private _el: ElementRef, private readonly _rd: Renderer2,
    @Inject(SVG_LOADER) private readonly _svgLoader: ISvgLoaderService,
    @Inject(SVG_DIRECTIVE_DEFAULT_STYLES) private readonly defaultStyles: any,
    // tslint:disable-next-line:readonly-array
    @Inject(SVG_DIRECTIVE_PARENT_STYLE_KEYS) private readonly _applyStylesToParent: string[]) { }

  ngOnInit() {
    this._svgLoader
      .load(this.floSvg)
      .pipe(take(1), filter(Boolean))
      .subscribe(svgXml => {
        insertSvg(this._el.nativeElement)(svgXml)
        const styles = { ...this.defaultStyles, ...this.floSvgStyles }
        const styleSetter = setStyle(this._rd)(styles)
        const styleKeys = Object.keys(styles)
        const styleKeysForParent = styleKeys.filter(b => this._applyStylesToParent.includes(b))

        styleSetter(styleKeysForParent)(this._el.nativeElement)
        styleSetter(styleKeys)(this._el.nativeElement.firstChild)
      })
  }
}
