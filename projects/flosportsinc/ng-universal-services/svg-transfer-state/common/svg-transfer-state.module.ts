import { NgModule } from '@angular/core'
import { SvgTransferStateDirective } from './svg-transfer-state.directive'
import { SVG_DIRECTIVE_DEFAULT_STYLES, SVG_DIRECTIVE_PARENT_STYLE_KEYS } from './svg-transfer-state.tokens'

@NgModule({
  declarations: [SvgTransferStateDirective],
  exports: [SvgTransferStateDirective],
  providers: [
    {
      provide: SVG_DIRECTIVE_DEFAULT_STYLES,
      useValue: {
        height: '24px'
      }
    },
    {
      provide: SVG_DIRECTIVE_PARENT_STYLE_KEYS,
      useValue: ['height', 'width']
    }
  ]
})
export class SvgTransferStateModule { }
