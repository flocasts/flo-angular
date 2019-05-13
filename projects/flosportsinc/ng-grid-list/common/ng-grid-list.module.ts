import { FloGridListComponent, FloGridListItemDirective } from './list/grid-list.component'
import { FloGridTilesComponent } from './grid/grid-tiles.component'
import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FloGridListDragDropDirective } from './ng-grid-list-drag-drop.directive'
import { FloGridListOverlayDirective, FloGridListItemNoneDirective, FloGridListItemSomeDirective } from './grid/grid.tiles.directive'
import {
  FLO_GRID_LIST_COUNT, FLO_GRID_LIST_GUID_GEN, FLO_GRID_LIST_MIN_COUNT,
  FLO_GRID_LIST_MAX_COUNT, FLO_GRID_LIST_OVERLAY_ENABLED, FLO_GRID_LIST_OVERLAY_START,
  FLO_GRID_LIST_OVERLAY_FADEOUT, FLO_GRID_LIST_OVERLAY_THROTTLE, FLO_GRID_LIST_OVERLAY_NG_CLASS,
  FLO_GRID_LIST_OVERLAY_NG_STYLE, FLO_GRID_LIST_MAX_HEIGHT, FLO_GRID_LIST_SELECTED_INDEX,
  FLO_GRID_LIST_OVERLAY_STATIC, FLO_GRID_LIST_ITEMS, FLO_GRID_LIST_DRAG_DROP_ENABLED,
  FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED, FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY
} from './ng-grid-list.tokens'
import {
  DEFAULT_FLO_GRID_LIST_MIN_VIEWCOUNT,
  DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT,
  DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT,
  DEFAULT_FLO_GRID_LIST_OVERLAY_ENABLED,
  DEFAULT_FLO_GRID_LIST_OVERLAY_START,
  DEFAULT_FLO_GRID_LIST_OVERLAY_FADEOUT,
  DEFAULT_FLO_GRID_LIST_OVERLAY_THROTTLE,
  DEFAULT_FLO_GRID_LIST_OVERLAY_NG_CLASS,
  DEFAULT_FLO_GRID_LIST_OVERLAY_NG_STYLE,
  DEFAULT_FLO_GRID_LIST_OVERLAY_STATIC,
  DEFAULT_FLO_GRID_LIST_MAX_HEIGHT,
  DEFAULT_FLO_GRID_LIST_ITEMS,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_ENABLED,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_LISTS_ENABLED,
  DEFAULT_FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY
} from './ng-grid-list.module.defaults'

export interface IStringDict {
  readonly [key: string]: string
}

export interface OverlayConfiguration {
  readonly enabled: boolean
  readonly static: boolean
  readonly fadeout: number
  readonly start: boolean
  readonly throttle: number,
  readonly ngStyle: Partial<IStringDict>
  readonly ngClass: Partial<IStringDict>
}

/**
 * Configure global defaults such that every
 * instance start with the same configuration
 */
export interface FloGridListModuleConfiguration {
  readonly items: ReadonlyArray<any>

  /** Number of viewports shown on start */
  readonly count: number

  /** Minimum number of viewports shown */
  readonly min: number

  /** Maximum number of viewports shown */
  readonly max: number

  /** Maximum height of container */
  readonly maxHeight: number

  /** Starting selection box. Defaults to 0 */
  readonly selectedIndex: number

  /** When view count increases, set selection box to next empty square  */
  readonly autoSelectNextEmptyItem: boolean

  /** Allow drag drop of grid items. Defaults to true */
  readonly dragDropEnabled: boolean

  /** Allow drag/drop of list onto grid. Defaults to true */
  readonly dragDropFromListsEnabled: boolean

  /** Overlay configuration */
  readonly overlay: Partial<OverlayConfiguration>
}

export function defaultFloGridListGuidGenerator() {
  const lambda = () =>
    ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11)
      // tslint:disable-next-line: no-bitwise
      .replace(/[018]/g, (c: any) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
  return lambda
}

@NgModule({
  imports: [CommonModule],
  declarations: [
    FloGridTilesComponent,
    FloGridListComponent,
    FloGridListItemDirective,
    FloGridListOverlayDirective,
    FloGridListItemSomeDirective,
    FloGridListItemNoneDirective,
    FloGridListDragDropDirective
  ],
  exports: [
    FloGridTilesComponent,
    FloGridListComponent,
    FloGridListItemDirective,
    FloGridListOverlayDirective,
    FloGridListItemSomeDirective,
    FloGridListItemNoneDirective,
    FloGridListDragDropDirective
  ],
  providers: [
    {
      provide: FLO_GRID_LIST_GUID_GEN,
      useFactory: defaultFloGridListGuidGenerator
    },
    {
      provide: FLO_GRID_LIST_ITEMS,
      useValue: DEFAULT_FLO_GRID_LIST_ITEMS
    },
    {
      provide: FLO_GRID_LIST_MIN_COUNT,
      useValue: DEFAULT_FLO_GRID_LIST_MIN_VIEWCOUNT
    },
    {
      provide: FLO_GRID_LIST_MAX_COUNT,
      useValue: DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT
    },
    {
      provide: FLO_GRID_LIST_COUNT,
      useValue: DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT
    },
    {
      provide: FLO_GRID_LIST_MAX_HEIGHT,
      useValue: DEFAULT_FLO_GRID_LIST_MAX_HEIGHT
    },
    {
      provide: FLO_GRID_LIST_SELECTED_INDEX,
      useValue: 0
    },
    {
      provide: FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY,
      useValue: DEFAULT_FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY
    },
    {
      provide: FLO_GRID_LIST_OVERLAY_ENABLED,
      useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_ENABLED
    },
    {
      provide: FLO_GRID_LIST_OVERLAY_STATIC,
      useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_STATIC
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
    },
    {
      provide: FLO_GRID_LIST_OVERLAY_NG_CLASS,
      useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_NG_CLASS
    },
    {
      provide: FLO_GRID_LIST_OVERLAY_NG_STYLE,
      useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_NG_STYLE
    },
    {
      provide: FLO_GRID_LIST_DRAG_DROP_ENABLED,
      useValue: DEFAULT_FLO_GRID_LIST_DRAG_DROP_ENABLED
    },
    {
      provide: FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED,
      useValue: DEFAULT_FLO_GRID_LIST_DRAG_DROP_LISTS_ENABLED
    }
  ]
})
export class FloGridListModule {
  static config(cfg: Partial<FloGridListModuleConfiguration>): ModuleWithProviders {
    const config: FloGridListModuleConfiguration = {
      items: DEFAULT_FLO_GRID_LIST_ITEMS,
      count: DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT,
      max: DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT,
      min: DEFAULT_FLO_GRID_LIST_MIN_VIEWCOUNT,
      maxHeight: DEFAULT_FLO_GRID_LIST_MAX_HEIGHT,
      autoSelectNextEmptyItem: DEFAULT_FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY,
      dragDropEnabled: DEFAULT_FLO_GRID_LIST_DRAG_DROP_ENABLED,
      dragDropFromListsEnabled: DEFAULT_FLO_GRID_LIST_DRAG_DROP_LISTS_ENABLED,
      selectedIndex: 0,
      ...cfg,
      overlay: {
        enabled: DEFAULT_FLO_GRID_LIST_OVERLAY_ENABLED,
        start: DEFAULT_FLO_GRID_LIST_OVERLAY_START,
        fadeout: DEFAULT_FLO_GRID_LIST_OVERLAY_FADEOUT,
        throttle: DEFAULT_FLO_GRID_LIST_OVERLAY_THROTTLE,
        static: DEFAULT_FLO_GRID_LIST_OVERLAY_STATIC,
        ...cfg.overlay,
        ngClass: {
          ...DEFAULT_FLO_GRID_LIST_OVERLAY_NG_CLASS,
          ...(cfg.overlay || {}).ngClass
        },
        ngStyle: {
          ...DEFAULT_FLO_GRID_LIST_OVERLAY_NG_STYLE,
          ...(cfg.overlay || {}).ngStyle
        }
      }
    }

    return {
      ngModule: FloGridListModule,
      providers: [
        {
          provide: FLO_GRID_LIST_ITEMS,
          useValue: config.items
        },
        {
          provide: FLO_GRID_LIST_MIN_COUNT,
          useValue: config.min
        },
        {
          provide: FLO_GRID_LIST_MAX_COUNT,
          useValue: config.max
        },
        {
          provide: FLO_GRID_LIST_COUNT,
          useValue: config.count
        },
        {
          provide: FLO_GRID_LIST_MAX_HEIGHT,
          useValue: config.maxHeight
        },
        {
          provide: FLO_GRID_LIST_SELECTED_INDEX,
          useValue: config.selectedIndex
        },
        {
          provide: FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY,
          useValue: config.autoSelectNextEmptyItem
        },
        {
          provide: FLO_GRID_LIST_OVERLAY_ENABLED,
          useValue: config.overlay.enabled
        },
        {
          provide: FLO_GRID_LIST_OVERLAY_STATIC,
          useValue: config.overlay.static
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
        },
        {
          provide: FLO_GRID_LIST_OVERLAY_NG_CLASS,
          useValue: config.overlay.ngClass
        },
        {
          provide: FLO_GRID_LIST_OVERLAY_NG_STYLE,
          useValue: config.overlay.ngStyle
        },
        {
          provide: FLO_GRID_LIST_DRAG_DROP_ENABLED,
          useValue: config.dragDropEnabled
        },
        {
          provide: FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED,
          useValue: config.dragDropFromListsEnabled
        }
      ]
    }
  }
}
