import { NgModule, ModuleWithProviders } from '@angular/core'
import { SvgTransferStateDirective } from './svg-transfer-state.directive'
import { ISvgLoaderErrorReturnValueStreamFunc, ISvgRequestPatternFunc } from './svg-transfer-state.interfaces'
import { HttpErrorResponse, HttpClient, HttpClientModule } from '@angular/common/http'
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

export const DEFAULT_STYLES = { height: '24px' }
export const DEFAULT_PARENT_STYLE_KEYS: ReadonlyArray<string> = ['height', 'width']

export interface ISvgTransferStateModuleConfigParams {
  readonly parentStyleKeys: ReadonlyArray<string>
  readonly styles: Object
}

const DEFAULT_CONFIG: ISvgTransferStateModuleConfigParams = {
  styles: DEFAULT_STYLES,
  parentStyleKeys: DEFAULT_PARENT_STYLE_KEYS
}

@NgModule({
  imports: [HttpClientModule],
  declarations: [SvgTransferStateDirective],
  exports: [SvgTransferStateDirective],
  providers: [
    {
      provide: SVG_DIRECTIVE_DEFAULT_STYLES,
      useValue: DEFAULT_STYLES
    },
    {
      provide: SVG_DIRECTIVE_PARENT_STYLE_KEYS,
      useValue: DEFAULT_PARENT_STYLE_KEYS
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
export class SvgTransferStateModule {
  static config(config: Partial<ISvgTransferStateModuleConfigParams> = {}): ModuleWithProviders {
    const _config = { ...DEFAULT_CONFIG, ...config }

    return {
      ngModule: SvgTransferStateModule,
      providers: [
        {
          provide: SVG_DIRECTIVE_DEFAULT_STYLES,
          useValue: _config.styles
        },
        {
          provide: SVG_DIRECTIVE_PARENT_STYLE_KEYS,
          useValue: _config.parentStyleKeys
        }
      ]
    }
  }
}
