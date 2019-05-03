import { NgModule, ModuleWithProviders } from '@angular/core'
import { FloGridTilesComponent } from './grid/grid-tiles.component'
import { FloGridListComponent, FloGridListItemDirective } from './list/grid-list.component'
import { CommonModule } from '@angular/common'
import {
  FLO_GRID_LIST_DEFAULT_VIEWCOUNT, FLO_GRID_LIST_GUID_GEN, FLO_GRID_LIST_MIN_VIEWCOUNT,
  FLO_GRID_LIST_MAX_VIEWCOUNT, FLO_GRID_LIST_OVERLAY_ENABLED, FLO_GRID_LIST_OVERLAY_START,
  FLO_GRID_LIST_OVERLAY_FADEOUT, FLO_GRID_LIST_OVERLAY_THROTTLE
} from './ng-grid-list.tokens'
import {
  DEFAULT_FLO_GRID_LIST_MIN_VIEWCOUNT,
  DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT,
  DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT,
  DEFAULT_FLO_GRID_LIST_OVERLAY_ENABLED,
  DEFAULT_FLO_GRID_LIST_OVERLAY_START,
  DEFAULT_FLO_GRID_LIST_OVERLAY_FADEOUT,
  DEFAULT_FLO_GRID_LIST_OVERLAY_THROTTLE
} from './ng-grid-list.module.defaults'

export interface OverlayConfiguration {
  readonly enabled: boolean
  readonly fadeout: number
  readonly start: boolean
  readonly throttle: number
}

/**
 * Configure global defaults such that every
 * instance start with the same configuration
 */
export interface FloGridListModuleConfiguration {
  /** Number of viewports shown on start */
  readonly count: number

  /** Minimum number of viewports shown */
  readonly min: number

  /** Maximum number of viewports shown */
  readonly max: number

  /** Overlay configuration */
  readonly overlay: Partial<OverlayConfiguration>
}

export function defaultFloGridListGuidGenerator() {
  return () =>
    ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11)
      // tslint:disable-next-line: no-bitwise
      .replace(/[018]/g, (c: any) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
}

@NgModule({
  imports: [CommonModule],
  declarations: [
    FloGridListComponent,
    FloGridTilesComponent,
    FloGridListItemDirective
  ],
  exports: [
    FloGridListComponent,
    FloGridTilesComponent,
    FloGridListItemDirective
  ],
  providers: [
    {
      provide: FLO_GRID_LIST_MIN_VIEWCOUNT,
      useValue: DEFAULT_FLO_GRID_LIST_MIN_VIEWCOUNT
    },
    {
      provide: FLO_GRID_LIST_MAX_VIEWCOUNT,
      useValue: DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT
    },
    {
      provide: FLO_GRID_LIST_DEFAULT_VIEWCOUNT,
      useValue: DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT
    },
    {
      provide: FLO_GRID_LIST_GUID_GEN,
      useFactory: defaultFloGridListGuidGenerator
    },
    {
      provide: FLO_GRID_LIST_OVERLAY_ENABLED,
      useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_ENABLED
    },
    {
      provide: FLO_GRID_LIST_OVERLAY_START,
      useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_START
    },
    {
      provide: FLO_GRID_LIST_OVERLAY_FADEOUT,
      useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_FADEOUT
    },
    {
      provide: FLO_GRID_LIST_OVERLAY_THROTTLE,
      useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_THROTTLE
    }
  ]
})
export class FloGridListModule {
  static config(cfg: Partial<FloGridListModuleConfiguration>): ModuleWithProviders {
    const config: FloGridListModuleConfiguration = {
      count: DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT,
      max: DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT,
      min: DEFAULT_FLO_GRID_LIST_MIN_VIEWCOUNT,
      ...cfg,
      overlay: {
        enabled: DEFAULT_FLO_GRID_LIST_OVERLAY_ENABLED,
        start: DEFAULT_FLO_GRID_LIST_OVERLAY_START,
        fadeout: DEFAULT_FLO_GRID_LIST_OVERLAY_FADEOUT,
        throttle: DEFAULT_FLO_GRID_LIST_OVERLAY_THROTTLE,
        ...cfg.overlay
      }
    }

    return {
      ngModule: FloGridListModule,
      providers: [
        {
          provide: FLO_GRID_LIST_MIN_VIEWCOUNT,
          useValue: config.min
        },
        {
          provide: FLO_GRID_LIST_MAX_VIEWCOUNT,
          useValue: config.max
        },
        {
          provide: FLO_GRID_LIST_DEFAULT_VIEWCOUNT,
          useValue: config.count
        },
        {
          provide: FLO_GRID_LIST_OVERLAY_ENABLED,
          useValue: config.overlay.enabled
        },
        {
          provide: FLO_GRID_LIST_OVERLAY_START,
          useValue: config.overlay.start
        },
        {
          provide: FLO_GRID_LIST_OVERLAY_FADEOUT,
          useValue: config.overlay.fadeout
        },
        {
          provide: FLO_GRID_LIST_OVERLAY_THROTTLE,
          useValue: config.overlay.throttle
        }
      ]
    }
  }
}
