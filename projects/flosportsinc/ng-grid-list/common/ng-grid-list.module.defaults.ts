import { isPlatformServer } from '@angular/common'

export const DEFAULT_FLO_GRID_LIST_ITEMS: ReadonlyArray<any> = []
export const DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT = 1
export const DEFAULT_FLO_GRID_LIST_MIN_VIEWCOUNT = 1
export const DEFAULT_FLO_GRID_LIST_MAX_VIEWCOUNT = 64
export const DEFAULT_FLO_GRID_LIST_MAX_HEIGHT = 800
export const DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_COUNT = false
export const DEFAULT_FLO_GRID_LIST_SELECT_NEXT_EMPTY_ON_ADD = false
export const DEFAULT_FLO_GRID_LIST_SELECT_FROM_LOWER_INDICES_FIRST = false
export const DEFAULT_FLO_GRID_LIST_CONTAINER_ID_PREFIX = '__fs_grid__'
export const DEFAULT_FLO_GRID_LIST_FILL_TO_FIT = true

export const DEFAULT_FLO_GRID_LIST_OVERLAY_ENABLED = true
export const DEFAULT_FLO_GRID_LIST_OVERLAY_START = true
export const DEFAULT_FLO_GRID_LIST_OVERLAY_FADEOUT = 2000
export const DEFAULT_FLO_GRID_LIST_OVERLAY_THROTTLE = 30
export const DEFAULT_FLO_GRID_LIST_OVERLAY_STATIC = false

export const DEFAULT_FLO_GRID_LIST_DRAG_DROP_ENABLED = true
export const DEFAULT_FLO_GRID_LIST_DRAG_DROP_LISTS_ENABLED = true
export const DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_ENABLED = true
export const DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_COLOR = '#808080'
export const DEFAULT_FLO_GRID_LIST_DRAG_DROP_HOVER_BG_OPACITY = 0.70

export const DEFAULT_FLO_GRID_LIST_OVERLAY_NG_CLASS = {}
export const DEFAULT_FLO_GRID_LIST_OVERLAY_NG_STYLE = {
  'color': 'white',
  'transition-property': 'all',
  'transition-duration': '.25s',
  'transition-timing-function': 'ease-in-out'
}

export const DEFAULT_FLO_GRID_LIST_AUTO_FILL_FROM_LIST_ON_LOAD = false
export const DEFAULT_FLO_GRID_LIST_ASPECT_RATIO = .5625 // 16/9 <=> 9/16 => .5625

export function DEFAULT_FLO_GRID_LIST_DRAG_DROP_SUPPORTED(platformId: string) {
  return function supportsDragImage() {
    return isPlatformServer(platformId)
      ? false
      : 'setDragImage' in (((window as any).DataTransfer || ((window as any).Clipboard) || {}).prototype || {})
  }
}
