import { NgModule } from '@angular/core'
import { SvgTransferStateDirective } from './svg-transfer-state.directive'
import {
  SVG_DIRECTIVE_DEFAULT_STYLES, SVG_DIRECTIVE_PARENT_STYLE_KEYS,
  SVG_REQUEST_PATTERN, SVG_REQUEST_PATTERN_BASE, SVG_LOADER_ERROR_RETURN_OPERATOR
} from './svg-transfer-state.tokens'
import { ISvgLoaderErrorReturnValueStreamFunc } from './svg-transfer-state.interfaces'
import { of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'

export function standardServerReqPatternFactory(dir: string) {
  const lambda = (svgKey: string) => `${dir}/${svgKey}.svg`
  return lambda
}

export function standardErrorValReturnFactory(): ISvgLoaderErrorReturnValueStreamFunc {
  const lambda = (_err: HttpErrorResponse) => {
    console.log(_err.message)
    return of(undefined)
  }
  return lambda
}

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
    },
    {
      provide: SVG_REQUEST_PATTERN,
      useFactory: standardServerReqPatternFactory,
      deps: [SVG_REQUEST_PATTERN_BASE]
    },
    {
      provide: SVG_LOADER_ERROR_RETURN_OPERATOR,
      useFactory: standardErrorValReturnFactory
    }
  ]
})
export class SvgTransferStateModule { }
