import { FloGridListComponent, FloGridListItemDirective } from './list/grid-list.component'
import { FloGridListViewComponent } from './grid/grid.component'
import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FloGridListDragDropDirective } from './ng-grid-list-drag-drop.directive'
import { FloGridListModuleConfiguration } from './ng-grid-list.config.interfaces'
import { FloGridListOverlayDirective, FloGridListItemNoneDirective, FloGridListItemSomeDirective } from './grid/grid.directive'
import {
  FLO_GRID_LIST_COUNT, FLO_GRID_LIST_GUID_GEN, FLO_GRID_LIST_MIN_COUNT,
  FLO_GRID_LIST_MAX_COUNT, FLO_GRID_LIST_OVERLAY_ENABLED, FLO_GRID_LIST_OVERLAY_START,
  FLO_GRID_LIST_OVERLAY_FADEOUT, FLO_GRID_LIST_OVERLAY_THROTTLE, FLO_GRID_LIST_OVERLAY_NG_CLASS,
  FLO_GRID_LIST_OVERLAY_NG_STYLE, FLO_GRID_LIST_MAX_HEIGHT, FLO_GRID_LIST_SELECTED_INDEX,
  FLO_GRID_LIST_OVERLAY_STATIC, FLO_GRID_LIST_ITEMS, FLO_GRID_LIST_DRAG_DROP_ENABLED,
  FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED, FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY, FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD
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
  DEFAULT_FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY,
  DEFAULT_FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD
} from './ng-grid-list.module.defaults'

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
    FloGridListViewComponent,
    FloGridListComponent,
    FloGridListItemDirective,
    FloGridListOverlayDirective,
    FloGridListItemSomeDirective,
    FloGridListItemNoneDirective,
    FloGridListDragDropDirective
  ],
  exports: [
    FloGridListViewComponent,
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
    },
    {
      provide: FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD,
      useValue: DEFAULT_FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD
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
      autoSelectNextEmptyOnCountChange: DEFAULT_FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY,
      selectedIndex: 0,
      ...cfg,
      list: {
        fillInitialListValues: DEFAULT_FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD,
        ...cfg.list
      },
      dragDrop: {
        enabled: DEFAULT_FLO_GRID_LIST_DRAG_DROP_ENABLED,
        allowFromLists: DEFAULT_FLO_GRID_LIST_DRAG_DROP_LISTS_ENABLED,
        ...cfg.dragDrop
      },
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
          useValue: config.autoSelectNextEmptyOnCountChange
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
          useValue: config.dragDrop.enabled
        },
        {
          provide: FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED,
          useValue: config.dragDrop.allowFromLists
        },
        {
          provide: FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD,
          useValue: config.list.fillInitialListValues
        }
      ]
    }
  }
}
