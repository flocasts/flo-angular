import { FloGridListComponent, FloGridListItemDirective } from './list/grid-list.component'
import { FloGridListViewComponent, IViewItem, ITrackByFn } from './grid/grid.component'
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
  FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED, FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY,
  FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD, FLO_GRID_LIST_ASPECT_RATIO,
  FLO_GRID_LIST_TRACK_BY_FN, IFloGridListBaseItem,
  FLO_GRID_LIST_CONTAINER_ID_PREFIX
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
  DEFAULT_FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD,
  DEFAULT_FLO_GRID_LIST_ASPECT_RATIO,
  DEFAULT_FLO_GRID_LIST_CONTAINER_ID_PREFIX
} from './ng-grid-list.module.defaults'

export function defaultFloGridListGuidGenerator() {
  const lambda = () =>
    ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11)
      // tslint:disable-next-line: no-bitwise
      .replace(/[018]/g, (c: any) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
  return lambda
}

export function defaultFloGridListTrackByFn() {
  const lambda: ITrackByFn<IFloGridListBaseItem> =
    (_idx: number, item: IViewItem<IFloGridListBaseItem>) =>
      item && item.value && item.value.id
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
    { provide: FLO_GRID_LIST_GUID_GEN, useFactory: defaultFloGridListGuidGenerator },
    { provide: FLO_GRID_LIST_ITEMS, useValue: DEFAULT_FLO_GRID_LIST_ITEMS },
    { provide: FLO_GRID_LIST_MIN_COUNT, useValue: DEFAULT_FLO_GRID_LIST_MIN_VIEWCOUNT },
    { provide: FLO_GRID_LIST_MAX_COUNT, useValue: DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT },
    { provide: FLO_GRID_LIST_COUNT, useValue: DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT },
    { provide: FLO_GRID_LIST_MAX_HEIGHT, useValue: DEFAULT_FLO_GRID_LIST_MAX_HEIGHT },
    { provide: FLO_GRID_LIST_SELECTED_INDEX, useValue: 0 },
    { provide: FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY, useValue: DEFAULT_FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY },
    { provide: FLO_GRID_LIST_OVERLAY_ENABLED, useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_ENABLED },
    { provide: FLO_GRID_LIST_OVERLAY_STATIC, useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_STATIC },
    { provide: FLO_GRID_LIST_OVERLAY_START, useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_START },
    { provide: FLO_GRID_LIST_OVERLAY_FADEOUT, useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_FADEOUT },
    { provide: FLO_GRID_LIST_OVERLAY_THROTTLE, useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_THROTTLE },
    { provide: FLO_GRID_LIST_OVERLAY_NG_CLASS, useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_NG_CLASS },
    { provide: FLO_GRID_LIST_OVERLAY_NG_STYLE, useValue: DEFAULT_FLO_GRID_LIST_OVERLAY_NG_STYLE },
    { provide: FLO_GRID_LIST_DRAG_DROP_ENABLED, useValue: DEFAULT_FLO_GRID_LIST_DRAG_DROP_ENABLED },
    { provide: FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED, useValue: DEFAULT_FLO_GRID_LIST_DRAG_DROP_LISTS_ENABLED },
    { provide: FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD, useValue: DEFAULT_FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD },
    { provide: FLO_GRID_LIST_ASPECT_RATIO, useValue: DEFAULT_FLO_GRID_LIST_ASPECT_RATIO },
    { provide: FLO_GRID_LIST_TRACK_BY_FN, useFactory: defaultFloGridListTrackByFn },
    { provide: FLO_GRID_LIST_CONTAINER_ID_PREFIX, useValue: DEFAULT_FLO_GRID_LIST_CONTAINER_ID_PREFIX }
  ]
})
export class FloGridListModule {
  static config(cfg: Partial<FloGridListModuleConfiguration>): ModuleWithProviders {
    return {
      ngModule: FloGridListModule,
      providers: [
        // tslint:disable: max-line-length
        { provide: FLO_GRID_LIST_ITEMS, useValue: cfg.items !== undefined ? cfg.items : DEFAULT_FLO_GRID_LIST_ITEMS },
        { provide: FLO_GRID_LIST_MIN_COUNT, useValue: cfg.min !== undefined ? cfg.min : DEFAULT_FLO_GRID_LIST_MIN_VIEWCOUNT },
        { provide: FLO_GRID_LIST_MAX_COUNT, useValue: cfg.max !== undefined ? cfg.max : DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT },
        { provide: FLO_GRID_LIST_COUNT, useValue: cfg.count !== undefined ? cfg.count : DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT },
        { provide: FLO_GRID_LIST_MAX_HEIGHT, useValue: cfg.maxHeight !== undefined ? cfg.maxHeight : DEFAULT_FLO_GRID_LIST_MAX_HEIGHT },
        { provide: FLO_GRID_LIST_SELECTED_INDEX, useValue: cfg.selectedIndex !== undefined ? cfg.selectedIndex : 0 },
        { provide: FLO_GRID_LIST_OVERLAY_ENABLED, useValue: cfg.overlay && cfg.overlay.enabled !== undefined ? cfg.overlay.enabled : DEFAULT_FLO_GRID_LIST_OVERLAY_ENABLED },
        { provide: FLO_GRID_LIST_OVERLAY_STATIC, useValue: cfg.overlay && cfg.overlay.static !== undefined ? cfg.overlay.static : DEFAULT_FLO_GRID_LIST_OVERLAY_STATIC },
        { provide: FLO_GRID_LIST_OVERLAY_START, useValue: cfg.overlay && cfg.overlay.start !== undefined ? cfg.overlay.start : DEFAULT_FLO_GRID_LIST_OVERLAY_START },
        { provide: FLO_GRID_LIST_OVERLAY_FADEOUT, useValue: cfg.overlay && cfg.overlay.fadeout !== undefined ? cfg.overlay.fadeout : DEFAULT_FLO_GRID_LIST_OVERLAY_FADEOUT },
        { provide: FLO_GRID_LIST_OVERLAY_THROTTLE, useValue: cfg.overlay && cfg.overlay.throttle !== undefined ? cfg.overlay.throttle : DEFAULT_FLO_GRID_LIST_OVERLAY_THROTTLE },
        { provide: FLO_GRID_LIST_OVERLAY_NG_CLASS, useValue: cfg.overlay && cfg.overlay.ngClass !== undefined ? cfg.overlay.ngClass : DEFAULT_FLO_GRID_LIST_OVERLAY_NG_CLASS },
        { provide: FLO_GRID_LIST_OVERLAY_NG_STYLE, useValue: cfg.overlay && cfg.overlay.ngStyle !== undefined ? cfg.overlay.ngStyle : DEFAULT_FLO_GRID_LIST_OVERLAY_NG_STYLE },
        { provide: FLO_GRID_LIST_DRAG_DROP_ENABLED, useValue: cfg.dragDrop && cfg.dragDrop.enabled !== undefined ? cfg.dragDrop.enabled : DEFAULT_FLO_GRID_LIST_DRAG_DROP_ENABLED },
        { provide: FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED, useValue: cfg.dragDrop && cfg.dragDrop.allowFromLists !== undefined ? cfg.dragDrop.allowFromLists : DEFAULT_FLO_GRID_LIST_DRAG_DROP_LISTS_ENABLED },
        { provide: FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD, useValue: cfg.list && cfg.list.fillInitialListValues !== undefined ? cfg.list.fillInitialListValues : DEFAULT_FLO_GRID_LIST_DRAG_DROP_LISTS_ENABLED },
        { provide: FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY, useValue: cfg.autoSelectNextEmptyOnCountChange !== undefined ? cfg.autoSelectNextEmptyOnCountChange : DEFAULT_FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY },
        { provide: FLO_GRID_LIST_CONTAINER_ID_PREFIX, useValue: cfg.containerIdPrefix !== undefined ? cfg.containerIdPrefix : DEFAULT_FLO_GRID_LIST_CONTAINER_ID_PREFIX },
      ]
    }
  }
}
