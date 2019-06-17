import { NgModule, ModuleWithProviders } from '@angular/core'
import { SvgBrowserLoaderService } from './svg-transfer-state.browser.service'
import { SvgBrowserLoaderCacheService } from './svg-transfer-state.browser.cache.service'
import { BrowserTransferStateModule } from '@angular/platform-browser'
import {
  SVG_LOADER, SVG_REQUEST_PATTERN_BASE, SVG_LOADER_BROWSER_CACHE,
  SVG_LOADER_BROWSER_CACHE_MAX_AGE
} from '@flosportsinc/ng-svg-transfer-state'

export const DEFAULT_PATH = 'assets/svg'
export const DEFAULT_MAX_AGE = 0

export interface SvgTransferStateBrowserModuleConfig {
  readonly dir?: string
  readonly cacheMaxAge?: number
}

@NgModule({
  imports: [BrowserTransferStateModule],
  providers: [
    { provide: SVG_LOADER, useClass: SvgBrowserLoaderService },
    { provide: SVG_REQUEST_PATTERN_BASE, useValue: DEFAULT_PATH },
    { provide: SVG_LOADER_BROWSER_CACHE, useClass: SvgBrowserLoaderCacheService }
  ]
})
export class SvgTransferStateBrowserModule {
  static withConfig(config?: Partial<SvgTransferStateBrowserModuleConfig>): ModuleWithProviders {
    return {
      ngModule: SvgTransferStateBrowserModule,
      providers: [
        {
          provide: SVG_REQUEST_PATTERN_BASE,
          useValue: config && config.dir || DEFAULT_PATH
        },
        {
          provide: SVG_LOADER_BROWSER_CACHE_MAX_AGE,
          useValue: config && config.cacheMaxAge || DEFAULT_MAX_AGE
        }
      ]
    }
  }
}
