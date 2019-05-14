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
