import { NgModule, ModuleWithProviders } from '@angular/core'
import { SVG_LOADER, SVG_REQUEST_PATTERN_BASE, SVG_SERVER_CACHE } from './svg-transfer-state.tokens'
import { SvgServerLoaderService } from './svg-transfer-state.server.service'

const DEFAULT_PATH = './dist/assets/svg'

@NgModule({
  providers: [
    {
      provide: SVG_LOADER,
      useClass: SvgServerLoaderService
    },
    {
      provide: SVG_REQUEST_PATTERN_BASE,
      useValue: DEFAULT_PATH
    },
    {
      provide: SVG_SERVER_CACHE,
      useValue: undefined
    }
  ]
})
export class SvgTransferStateServerModule {
  static withSvgAssetRoot(dir?: string): ModuleWithProviders {
    return {
      ngModule: SvgTransferStateServerModule,
      providers: [
        {
          provide: SVG_REQUEST_PATTERN_BASE,
          useValue: dir || DEFAULT_PATH
        }
      ]
    }
  }
}
