import { TestBed } from '@angular/core/testing'
import { SVG_REQUEST_PATTERN_BASE, SVG_LOADER_BROWSER_CACHE_MAX_AGE } from '@flosportsinc/ng-svg-transfer-state'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import {
  SvgTransferStateBrowserModule, SvgTransferStateBrowserModuleConfig,
  DEFAULT_PATH, DEFAULT_MAX_AGE
} from './svg-transfer-state.browser.module'

const setupTb = (config?: Partial<SvgTransferStateBrowserModuleConfig>) => {
  TestBed.configureTestingModule({
    providers: [
    ],
    imports: [
      HttpClientTestingModule,
      SvgTransferStateBrowserModule.withConfig(config)
    ]
  })
}

describe(SvgTransferStateBrowserModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  it('should setup with default values', () => {
    setupTb()

    const patternBase = TestBed.get(SVG_REQUEST_PATTERN_BASE)
    const maxAge = TestBed.get(SVG_LOADER_BROWSER_CACHE_MAX_AGE)

    expect(DEFAULT_PATH).toEqual(DEFAULT_PATH)
    expect(patternBase).toEqual(DEFAULT_PATH)
    expect(maxAge).toEqual(DEFAULT_MAX_AGE)
  })

  it('should default to a directory if config value is undefined', () => {
    setupTb({ dir: undefined })

    const patternBase = TestBed.get(SVG_REQUEST_PATTERN_BASE)
    expect(patternBase).toEqual(DEFAULT_PATH)
  })
})
