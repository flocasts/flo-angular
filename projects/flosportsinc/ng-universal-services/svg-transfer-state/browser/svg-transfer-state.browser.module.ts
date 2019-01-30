import { NgModule, ModuleWithProviders } from '@angular/core'
import { SvgBrowserLoaderService } from './svg-transfer-state.browser.service'
import { SvgBrowserLoaderCacheService } from './svg-transfer-state.browser.cache.service'
import {
  SVG_LOADER, SVG_REQUEST_PATTERN_BASE, SVG_LOADER_BROWSER_CACHE,
  SVG_LOADER_BROWSER_CACHE_MAX_AGE
} from './svg-transfer-state.tokens'
import { BrowserTransferStateModule } from '@angular/platform-browser'

export const DEFAULT_PATH = 'assets/svg'

export interface SvgTransferStateBrowserModuleConfig {
  readonly dir?: string
  readonly cacheMaxAge?: number
}

export const DEFAULT_CONFIG: SvgTransferStateBrowserModuleConfig = {
  dir: DEFAULT_PATH,
  cacheMaxAge: 0
}

@NgModule({
  imports: [BrowserTransferStateModule],
  providers: [
    {
      provide: SVG_LOADER,
      useClass: SvgBrowserLoaderService
    },
    {
      provide: SVG_REQUEST_PATTERN_BASE,
      useValue: DEFAULT_PATH
    },
    {
      provide: SVG_LOADER_BROWSER_CACHE,
      useClass: SvgBrowserLoaderCacheService
    }
  ]
})
export class SvgTransferStateBrowserModule {
  static withConfig(config: SvgTransferStateBrowserModuleConfig = DEFAULT_CONFIG): ModuleWithProviders {
    const _config = { ...DEFAULT_CONFIG, ...config }

    return {
      ngModule: SvgTransferStateBrowserModule,
      providers: [
        {
          provide: SVG_REQUEST_PATTERN_BASE,
          useValue: _config.dir || DEFAULT_PATH
        },
        {
          provide: SVG_LOADER_BROWSER_CACHE_MAX_AGE,
          useValue: _config.cacheMaxAge
        }
      ]
    }
  }
}
