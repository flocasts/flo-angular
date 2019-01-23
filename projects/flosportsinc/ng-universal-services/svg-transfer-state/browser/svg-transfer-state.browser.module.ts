import { NgModule, ModuleWithProviders } from '@angular/core'
import { SVG_LOADER, SVG_REQUEST_PATTERN_BASE } from './svg-transfer-state.tokens'
import { SvgBrowserLoaderService } from './svg-transfer-state.browser.service'

const DEFAULT_PATH = 'assets/svg'

@NgModule({
  providers: [
    {
      provide: SVG_LOADER,
      useClass: SvgBrowserLoaderService
    },
    {
      provide: SVG_REQUEST_PATTERN_BASE,
      useValue: DEFAULT_PATH
    }
  ]
})
export class SvgTransferStateBrowserModule {
  static withSvgAssetRoot(dir?: string): ModuleWithProviders {
    return {
      ngModule: SvgTransferStateBrowserModule,
      providers: [
        {
          provide: SVG_REQUEST_PATTERN_BASE,
          useValue: dir || DEFAULT_PATH
        }
      ]
    }
  }
}
