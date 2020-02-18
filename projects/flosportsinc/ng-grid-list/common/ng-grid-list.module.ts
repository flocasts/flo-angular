import { FloGridListComponent, FloGridListItemDirective } from './list/grid-list.component'
import { FloGridListViewComponent, IViewItem, ITrackByFn } from './grid/grid.component'
import { NgModule, ModuleWithProviders, PLATFORM_ID } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FloGridListDragDropDirective } from './ng-grid-list-drag-drop.directive'
import { FloGridListModuleConfiguration } from './ng-grid-list.config.interfaces'
import {
  FloGridListOverlayDirective,
  FloGridListItemNoneDirective,
  FloGridListItemSomeDirective,
  FloGridListItemSomeDragDirective,
  FloGridListItemNoneDragDirective
} from './grid/grid.directive'
import {
  FLO_GRID_LIST_COUNT, FLO_GRID_LIST_GUID_GEN, FLO_GRID_LIST_MIN_COUNT,
  FLO_GRID_LIST_MAX_COUNT, FLO_GRID_LIST_OVERLAY_ENABLED, FLO_GRID_LIST_OVERLAY_START,
  FLO_GRID_LIST_OVERLAY_FADEOUT, FLO_GRID_LIST_OVERLAY_THROTTLE, FLO_GRID_LIST_OVERLAY_NG_CLASS,
  FLO_GRID_LIST_OVERLAY_NG_STYLE, FLO_GRID_LIST_MAX_HEIGHT, FLO_GRID_LIST_SELECTED_INDEX,
  FLO_GRID_LIST_OVERLAY_STATIC, FLO_GRID_LIST_ITEMS, FLO_GRID_LIST_DRAG_DROP_ENABLED,
  FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED, FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT,
  FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD, FLO_GRID_LIST_ASPECT_RATIO,
  FLO_GRID_LIST_TRACK_BY_FN, FLO_GRID_LIST_CONTAINER_ID_PREFIX,
  FLO_GRID_LIST_FILL_TO_FIT, FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD,
  IFloGridListBaseItem,
  FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST,
  FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED,
  FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR,
  FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY,
  FLO_GRID_LIST_DRAG_DROP_SUPPORTED_FN
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
  DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT,
  DEFAULT_FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD,
  DEFAULT_FLO_GRID_LIST_ASPECT_RATIO,
  DEFAULT_FLO_GRID_LIST_CONTAINER_ID_PREFIX,
  DEFAULT_FLO_GRID_LIST_FILL_TO_FIT,
  DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD,
  DEFAULT_FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY,
  DEFAULT_FLO_GRID_LIST_DRAG_DROP_SUPPORTED
} from './ng-grid-list.module.defaults'

export function defaultFloGridListGuidGenerator() {
  const lambda = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // tslint:disable: no-bitwise
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
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
    FloGridListItemSomeDragDirective,
    FloGridListItemNoneDragDirective,
    FloGridListDragDropDirective
  ],
  exports: [
    FloGridListViewComponent,
    FloGridListComponent,
    FloGridListItemDirective,
    FloGridListOverlayDirective,
    FloGridListItemSomeDirective,
    FloGridListItemNoneDirective,
    FloGridListItemSomeDragDirective,
    FloGridListItemNoneDragDirective,
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
    { provide: FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT, useValue: DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT },
    { provide: FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD, useValue: DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD },
    { provide: FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST, useValue: DEFAULT_FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST },
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
    { provide: FLO_GRID_LIST_CONTAINER_ID_PREFIX, useValue: DEFAULT_FLO_GRID_LIST_CONTAINER_ID_PREFIX },
    { provide: FLO_GRID_LIST_FILL_TO_FIT, useValue: DEFAULT_FLO_GRID_LIST_FILL_TO_FIT },
    { provide: FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED, useValue: DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED },
    { provide: FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR, useValue: DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR },
    { provide: FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY, useValue: DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY },
    { provide: FLO_GRID_LIST_DRAG_DROP_SUPPORTED_FN, useFactory: DEFAULT_FLO_GRID_LIST_DRAG_DROP_SUPPORTED, deps: [PLATFORM_ID] }
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
        { provide: FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT, useValue: cfg.selectNextEmptyOnCount !== undefined ? cfg.selectNextEmptyOnCount : DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT },
        { provide: FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD, useValue: cfg.selectNextEmptyOnAdd !== undefined ? cfg.selectNextEmptyOnAdd : DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD },
        { provide: FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST, useValue: cfg.selectFromLowerIndicesFirst !== undefined ? cfg.selectFromLowerIndicesFirst : DEFAULT_FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST },
        { provide: FLO_GRID_LIST_CONTAINER_ID_PREFIX, useValue: cfg.containerIdPrefix !== undefined ? cfg.containerIdPrefix : DEFAULT_FLO_GRID_LIST_CONTAINER_ID_PREFIX },
        { provide: FLO_GRID_LIST_FILL_TO_FIT, useValue: cfg.fillToFit !== undefined ? cfg.fillToFit : DEFAULT_FLO_GRID_LIST_FILL_TO_FIT },
        { provide: FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED, useValue: cfg.dragDrop && cfg.dragDrop.dragOverBgEnabled !== undefined ? cfg.dragDrop.dragOverBgEnabled : DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED },
        { provide: FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR, useValue: cfg.dragDrop && cfg.dragDrop.dragOverBgColor !== undefined ? cfg.dragDrop.dragOverBgColor : DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR },
        { provide: FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY, useValue: cfg.dragDrop && cfg.dragDrop.dragOverBgOpacity !== undefined ? cfg.dragDrop.dragOverBgOpacity : DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY }
      ]
    }
  }
}
