import { InjectionToken } from '@angular/core'

export const ENV = new InjectionToken('fs.net.config')
export const ENV_CONFIG_DEFAULT = new InjectionToken('fs.net.cfg-browser-def')
export const ENV_CONFIG_TS_KEY = new InjectionToken('fs.net.cfg-ts-key')
export const NODE_ENV = new InjectionToken('fs.net.node-env')
export const NODE_ENV_USE_VALUES = new InjectionToken('fs.net.node-env-def')
export const ENV_CONFIG_SERVER_EXTRACTOR = new InjectionToken('fs.net.cfg-extractor')
export const ENV_CONFIG_SERVER_REPLACER = new InjectionToken('fs.net.cfg-replacer')
export const ENV_CONFIG_SERVER_SELECTED = new InjectionToken('fs.net.cfg-selected')
