import { InjectionToken } from '@angular/core'

export const FLO_GRID_LIST_ITEMS = new InjectionToken('fs.grid.list.items')

export const FLO_GRID_LIST_COUNT = new InjectionToken('fs.grid.list.count')
export const FLO_GRID_LIST_MIN_COUNT = new InjectionToken('fs.grid.list.count.min')
export const FLO_GRID_LIST_MAX_COUNT = new InjectionToken('fs.grid.list.count.max')
export const FLO_GRID_LIST_MAX_HEIGHT = new InjectionToken('fs.grid.list.maxheight')
export const FLO_GRID_LIST_SELECTED_INDEX = new InjectionToken('fs.grid.list.selectedIndex')
export const FLO_GRID_LIST_AUTO_SELECT_NEXT_EMPTY = new InjectionToken('fs.grid.list.selectNext')

export const FLO_GRID_LIST_GUID_GEN = new InjectionToken('fs.grid.list.guid')

export const FLO_GRID_LIST_OVERLAY_ENABLED = new InjectionToken('fs.grid.list.overlay.enabled')
export const FLO_GRID_LIST_OVERLAY_START = new InjectionToken('fs.grid.list.overlay.start')
export const FLO_GRID_LIST_OVERLAY_FADEOUT = new InjectionToken('fs.grid.list.overlay.fadeout')
export const FLO_GRID_LIST_OVERLAY_THROTTLE = new InjectionToken('fs.grid.list.overlay.throttle')
export const FLO_GRID_LIST_OVERLAY_STATIC = new InjectionToken('fs.grid.list.overlay.static')
export const FLO_GRID_LIST_OVERLAY_NG_CLASS = new InjectionToken('fs.grid.list.overlay.ngclass')
export const FLO_GRID_LIST_OVERLAY_NG_STYLE = new InjectionToken('fs.grid.list.overlay.ngstyle')

export const FLO_GRID_LIST_DRAG_DROP_ENABLED = new InjectionToken('fs.grid.list.dragdrop.enabled')
export const FLO_GRID_LIST_DRAG_DROP_FROM_LISTS_ENABLED = new InjectionToken('fs.grid.list.dragdroplists.enabled')

export const FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD = new InjectionToken('fs.grid.list.lst.autofill')

export const FLO_GRID_LIST_ASPECT_RATIO = new InjectionToken('fs.grid.list.lst.aspect')

export interface IFloGridListBaseItem {
  readonly id: string
}
