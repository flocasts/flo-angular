import { InjectionToken } from '@angular/core'

export const FLO_GRID_LIST_ITEMS = new InjectionToken('flo.grid.list.items')

export const FLO_GRID_LIST_COUNT = new InjectionToken('flo.grid.list.count')
export const FLO_GRID_LIST_MIN_COUNT = new InjectionToken('flo.grid.list.count.min')
export const FLO_GRID_LIST_MAX_COUNT = new InjectionToken('flo.grid.list.count.max')
export const FLO_GRID_LIST_MAX_HEIGHT = new InjectionToken('flo.grid.list.maxheight')
export const FLO_GRID_LIST_SELECTED_INDEX = new InjectionToken('flo.grid.list.selectedIndex')
export const FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY = new InjectionToken('flo.grid.list.selectNext')

export const FLO_GRID_LIST_GUID_GEN = new InjectionToken('flo.grid.list.guid')

export const FLO_GRID_LIST_OVERLAY_ENABLED = new InjectionToken('flo.grid.list.overlay.enabled')
export const FLO_GRID_LIST_OVERLAY_START = new InjectionToken('flo.grid.list.overlay.start')
export const FLO_GRID_LIST_OVERLAY_FADEOUT = new InjectionToken('flo.grid.list.overlay.fadeout')
export const FLO_GRID_LIST_OVERLAY_THROTTLE = new InjectionToken('flo.grid.list.overlay.throttle')
export const FLO_GRID_LIST_OVERLAY_STATIC = new InjectionToken('flo.grid.list.overlay.static')
export const FLO_GRID_LIST_OVERLAY_NG_CLASS = new InjectionToken('flo.grid.list.overlay.ngclass')
export const FLO_GRID_LIST_OVERLAY_NG_STYLE = new InjectionToken('flo.grid.list.overlay.ngstyle')

export const FLO_GRID_LIST_DRAG_DROP_ENABLED = new InjectionToken('flo.grid.list.dragdrop.enabled')
export const FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED = new InjectionToken('flo.grid.list.dragdroplists.enabled')

export const FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD = new InjectionToken('flo.grid.list.lst.autofill')

export interface IFloGridListBaseItem {
  readonly id: string
}
