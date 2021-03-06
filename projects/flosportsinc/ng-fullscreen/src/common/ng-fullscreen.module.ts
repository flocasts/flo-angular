import { NgModule, ModuleWithProviders, ChangeDetectorRef } from '@angular/core'
import { FloFullscreenService } from './ng-fullscreen.service'
import { CommonModule } from '@angular/common'
import {
  FS_FULLSCREEN_REQUEST_EVENTS, FS_FULLSCREEN_EXIT_EVENTS, FS_FULLSCREEN_CHANGE_EVENTS,
  FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, FS_FULLSCREEN_ELEMENT, FS_FULLSCREEN_ENABLED,
  FS_FULLSCREEN_ENABLED_FUNC, FS_FULLSCREEN_IOS_POLL_MS, FS_FULLSCREEN_IOS_POLL_ENABLED
} from './ng-fullscreen.tokens'
import {
  DEFAULT_FS_FULLSCREEN_REQUEST_EVENTS, DEFAULT_FS_FULLSCREEN_EXIT_EVENTS, DEFAULT_FS_FULLSCREEN_CHANGE_EVENTS,
  DEFAULT_FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, DEFAULT_FS_FULLSCREEN_ELEMENT, DEFAULT_FS_FULLSCREEN_ENABLED,
  DEFAULT_FS_FULLSCREEN_ENABLED_FUNC,
  DEFAULT_FS_FULLSCREEN_IOS_POLL_MS,
  DEFAULT_FS_FULLSCREEN_IOS_POLL_ENABLED
} from './ng-fullscreen.tokens.defaults'

export interface FloFullscreenCommonModuleConfig {
  readonly ios: Partial<FloFullscreenCommonModuleIosPollingConfig>
}

export interface FloFullscreenCommonModuleIosPollingConfig {
  readonly enabled: boolean
  readonly pollDurationMs: number
}

@NgModule({
  imports: [CommonModule],
  exports: [CommonModule],
  providers: [
    FloFullscreenService,
    { provide: FS_FULLSCREEN_REQUEST_EVENTS, useValue: DEFAULT_FS_FULLSCREEN_REQUEST_EVENTS },
    { provide: FS_FULLSCREEN_EXIT_EVENTS, useValue: DEFAULT_FS_FULLSCREEN_EXIT_EVENTS },
    { provide: FS_FULLSCREEN_CHANGE_EVENTS, useValue: DEFAULT_FS_FULLSCREEN_CHANGE_EVENTS },
    { provide: FS_FULLSCREEN_ELEMENT_ERROR_EVENTS, useValue: DEFAULT_FS_FULLSCREEN_ELEMENT_ERROR_EVENTS },
    { provide: FS_FULLSCREEN_ELEMENT, useValue: DEFAULT_FS_FULLSCREEN_ELEMENT },
    { provide: FS_FULLSCREEN_ENABLED, useValue: DEFAULT_FS_FULLSCREEN_ENABLED },
    { provide: FS_FULLSCREEN_ENABLED_FUNC, useFactory: DEFAULT_FS_FULLSCREEN_ENABLED_FUNC },
    { provide: FS_FULLSCREEN_IOS_POLL_MS, useValue: DEFAULT_FS_FULLSCREEN_IOS_POLL_MS },
    { provide: FS_FULLSCREEN_IOS_POLL_ENABLED, useValue: DEFAULT_FS_FULLSCREEN_IOS_POLL_ENABLED }
  ]
})
export class FloFullscreenCommonModule {
  static config(config: Partial<FloFullscreenCommonModuleConfig>): ModuleWithProviders {
    return {
      ngModule: FloFullscreenCommonModule,
      providers: [
        {
          provide: FS_FULLSCREEN_IOS_POLL_ENABLED,
          useValue: config.ios && typeof config.ios.enabled === 'boolean' ? config.ios.enabled : DEFAULT_FS_FULLSCREEN_IOS_POLL_ENABLED
        },
        {
          provide: FS_FULLSCREEN_IOS_POLL_MS,
          useValue: config.ios && typeof config.ios.pollDurationMs === 'number'
            ? config.ios.pollDurationMs
            : DEFAULT_FS_FULLSCREEN_IOS_POLL_MS
        }
      ]
    }
  }
}
