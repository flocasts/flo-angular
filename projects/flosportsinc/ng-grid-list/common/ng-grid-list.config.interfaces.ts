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

  /** When view count increases, set selection box to next empty square  */
  readonly autoSelectNextEmptyOnCountChange: boolean

  /** To prevent flickers from server rendered pages, enforce an aspect ratio.
   *  defaults to 56.65% which is the reverse calculation for a 16/9 ratio
   */
  readonly syncServerAspectRatio: string | boolean

  /** List configuration */
  readonly list: Partial<ListConfiguration>

  /** Overlay configuration */
  readonly overlay: Partial<OverlayConfiguration>

  /** Drag and drop configuration */
  readonly dragDrop: Partial<DragDropConfiguration>
}
