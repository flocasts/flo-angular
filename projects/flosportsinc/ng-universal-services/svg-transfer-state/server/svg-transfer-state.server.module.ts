import { NgModule, ModuleWithProviders } from '@angular/core'
import { SVG_LOADER } from './svg-transfer-state.tokens'
import { SvgServerLoaderService } from './svg-transfer-state.server.service'
import { SVG_SERVER_REQUEST_PATTERN, SVG_SERVER_REQUEST_PATTERN_BASE } from './svg-transfer-state.server.tokens'

export function standardServerReqPatternFactory(dir: string) {
  const lambda = (svgKey: string) => `${dir}/${svgKey}.svg`
  return lambda
}

@NgModule({
  providers: [
    {
      provide: SVG_LOADER,
      useClass: SvgServerLoaderService
    },
    {
      provide: SVG_SERVER_REQUEST_PATTERN,
      useFactory: standardServerReqPatternFactory,
      deps: [SVG_SERVER_REQUEST_PATTERN_BASE]
    }
  ]
})
export class SvgTransferStateServerModule {
  static withAssetDirectory(directory?: string): ModuleWithProviders {
    return {
      ngModule: SvgTransferStateServerModule,
      providers: [
        {
          provide: SVG_SERVER_REQUEST_PATTERN_BASE,
          useValue: directory || './dist/assets/svg'
        }
      ]
    }
  }
}
