import { InjectionToken } from '@angular/core'

export const SVG_LOADER = new InjectionToken('fs.svg.loader')
export const SVG_LOADER_HTTP_REQUEST = new InjectionToken('fs.svg.http')
export const SVG_LOADER_BROWSER_CACHE = new InjectionToken('fs.svg.brwsr.cache')
export const SVG_LOADER_BROWSER_CACHE_MAX_AGE = new InjectionToken('fs.svg.brwsr.cache.ma')
export const SVG_REQUEST_PATTERN = new InjectionToken('fs.svg.pattern')
export const SVG_REQUEST_PATTERN_BASE = new InjectionToken('fs.svg.svr.pattern.base')
export const SVG_TRANSFER_KEY = new InjectionToken<string>('fs.svg.ts.key')
export const SVG_DIRECTIVE_DEFAULT_STYLES = new InjectionToken('fs.svg.dir.styles')
export const SVG_DIRECTIVE_PARENT_STYLE_KEYS = new InjectionToken('fs.svg.dir.parent-styles')
export const SVG_LOADER_ERROR_RETURN_OPERATOR = new InjectionToken('fs.svg.err.operator')
export const SVG_SERVER_CACHE = new InjectionToken('fs.svg.svr.cache')
