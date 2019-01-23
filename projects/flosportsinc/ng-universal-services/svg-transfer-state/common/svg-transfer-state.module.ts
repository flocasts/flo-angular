import { NgModule } from '@angular/core'
import { SvgTransferStateDirective } from './svg-transfer-state.directive'
import { ISvgLoaderErrorReturnValueStreamFunc, ISvgRequestPatternFunc } from './svg-transfer-state.interfaces'
import { HttpErrorResponse, HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs'
import {
  SVG_DIRECTIVE_DEFAULT_STYLES, SVG_DIRECTIVE_PARENT_STYLE_KEYS,
  SVG_REQUEST_PATTERN, SVG_REQUEST_PATTERN_BASE, SVG_LOADER_ERROR_RETURN_OPERATOR, SVG_LOADER_HTTP_REQUEST
} from './svg-transfer-state.tokens'

export function standardServerReqPatternFactory(dir: string): ISvgRequestPatternFunc {
  const lambda = (svgKey: string) => svgKey.includes('://')
    ? svgKey
    : `${dir}/${svgKey}.svg`
  return lambda
}

export function standardErrorValReturnFactory(): ISvgLoaderErrorReturnValueStreamFunc {
  const lambda = (_err: HttpErrorResponse) => {
    console.log(_err.message)
    return of(undefined)
  }
  return lambda
}

export function defaultHttpFactory(http: HttpClient, reqPattern: ISvgRequestPatternFunc, errHandler: ISvgLoaderErrorReturnValueStreamFunc) {
  const lambda = (svgKey: string) => http.get(reqPattern(svgKey), { responseType: 'text', withCredentials: false }).pipe(
    catchError(err => errHandler(err))
  )
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
    },
    {
      provide: SVG_LOADER_HTTP_REQUEST,
      useFactory: defaultHttpFactory,
      deps: [HttpClient, SVG_REQUEST_PATTERN, SVG_LOADER_ERROR_RETURN_OPERATOR]
    }
  ]
})
export class SvgTransferStateModule { }
