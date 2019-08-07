import { InjectionToken } from '@angular/core'
import { ITrackByFn } from './grid/grid.component'

// Basic configuration for behavior and look and feel
export const FLO_GRID_LIST_ITEMS = new InjectionToken('fs.grid.list.items')
export const FLO_GRID_LIST_COUNT = new InjectionToken<number>('fs.grid.list.count')
export const FLO_GRID_LIST_MIN_COUNT = new InjectionToken<number>('fs.grid.list.count.min')
export const FLO_GRID_LIST_MAX_COUNT = new InjectionToken<number>('fs.grid.list.count.max')
export const FLO_GRID_LIST_MAX_HEIGHT = new InjectionToken<number>('fs.grid.list.maxheight')
export const FLO_GRID_LIST_SELECTED_INDEX = new InjectionToken<number>('fs.grid.list.selectedIndex')
export const FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT = new InjectionToken<boolean>('fs.grid.list.select.next.count')
export const FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD = new InjectionToken<boolean>('fs.grid.list.select.next.add')
export const FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST = new InjectionToken<boolean>('fs.grid.list.select.lwr.idx')
export const FLO_GRID_LIST_CONTAINER_ID_PREFIX = new InjectionToken<string>('fs.grid.list.id.prefix')
export const FLO_GRID_LIST_FILL_TO_FIT = new InjectionToken<boolean>('fs.grid.list.fill.fit')
export const FLO_GRID_LIST_GUID_GEN = new InjectionToken('fs.grid.list.guid')
export const FLO_GRID_LIST_TRACK_BY_FN = new InjectionToken<ITrackByFn>('fs.grid.list.trackby')
export const FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD = new InjectionToken('fs.grid.list.lst.autofill')
export const FLO_GRID_LIST_ASPECT_RATIO = new InjectionToken('fs.grid.list.lst.aspect')

// PRIMARY OVERLAY
export const FLO_GRID_LIST_OVERLAY_ENABLED = new InjectionToken<boolean>('fs.grid.list.overlay.enabled')
export const FLO_GRID_LIST_OVERLAY_START = new InjectionToken('fs.grid.list.overlay.start')
export const FLO_GRID_LIST_OVERLAY_FADEOUT = new InjectionToken('fs.grid.list.overlay.fadeout')
export const FLO_GRID_LIST_OVERLAY_THROTTLE = new InjectionToken('fs.grid.list.overlay.throttle')
export const FLO_GRID_LIST_OVERLAY_STATIC = new InjectionToken('fs.grid.list.overlay.static')
export const FLO_GRID_LIST_OVERLAY_NG_CLASS = new InjectionToken('fs.grid.list.overlay.ngclass')
export const FLO_GRID_LIST_OVERLAY_NG_STYLE = new InjectionToken('fs.grid.list.overlay.ngstyle')

// DRAG DROP
export const FLO_GRID_LIST_DRAG_DROP_ENABLED = new InjectionToken<boolean>('fs.grid.list.dragdrop.enabled')
export const FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED = new InjectionToken<boolean>('fs.grid.list.dragdroplists.enabled')
export const FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED = new InjectionToken<boolean>('fs.grid.list.hover.enabled')
export const FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR = new InjectionToken<string>('fs.grid.list.hover.bgcolor')
export const FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY = new InjectionToken<string>('fs.grid.list.hover.bgopacity')
export const FLO_GRID_LIST_DRAG_DROP_IMAGE_ENABLED = new InjectionToken<boolean>('fs.grid.list.drag.img.enabled')
export const FLO_GRID_LIST_DRAG_DROP_IMAGE_ITEM_KEY = new InjectionToken<string>('fs.grid.list.drag.img.key')
export const FLO_GRID_LIST_DRAG_DROP_IMAGE_DEFAULT_SOME = new InjectionToken<string>('fs.grid.list.drag.img.some')
export const FLO_GRID_LIST_DRAG_DROP_IMAGE_DEFAULT_NONE = new InjectionToken<string>('fs.grid.list.drag.img.none')

export interface IFloGridListBaseItem {
  readonly id: string
}
