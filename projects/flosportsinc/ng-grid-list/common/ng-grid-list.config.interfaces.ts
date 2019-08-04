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

export interface DragDropConfiguration {
  /** Allow drag drop of grid items. Defaults to true */
  readonly enabled: boolean

  /** Allow drag/drop of list onto grid. Defaults to true */
  readonly allowFromLists: boolean
}

export interface ListConfiguration {
  readonly fillInitialListValues: boolean
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

  /**
   * Prefix the grid-list-item container ID's so they do not conflict downstream
   * if ID is used elsewhere in the application.
   * Defaults to '__fs_grid__' which would give the outer div
   * items the following pattern: <div id="__fs_grid__someItemId1"></div>
   **/
  readonly containerIdPrefix: string

  /** When view count increases, set selection box to next empty square  */
  readonly selectNextEmptyOnCount: boolean

  /** When item is added (not via drag drop), set selection box to next empty square  */
  readonly selectNextEmptyOnAdd: boolean

  /** To prevent flickers from server rendered pages, enforce an aspect ratio.
   *  defaults to 56.65% which is the reverse calculation for a 16/9 ratio
   */
  readonly syncServerAspectRatio: string | boolean

  /**
   * Prevent horizontal bars inside of grid tiles when media is not the correct aspect-ratio
   * This will apply css { 'object-fill': 'cover' }, among others.
   */
  readonly fillToFit: boolean

  /** List configuration */
  readonly list: Partial<ListConfiguration>

  /** Overlay configuration */
  readonly overlay: Partial<OverlayConfiguration>

  /** Drag and drop configuration */
  readonly dragDrop: Partial<DragDropConfiguration>
}
