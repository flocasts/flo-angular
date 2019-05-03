import { NgModule, ModuleWithProviders } from '@angular/core'
import { FloGridTilesComponent } from './grid/grid-tiles.component'
import { FloGridListComponent, FloGridListItemDirective } from './list/grid-list.component'
import { FLO_GRID_LIST_VIEWCOUNT, FLO_GRID_LIST_GUID_GEN } from './ng-grid-list.tokens'
import { CommonModule } from '@angular/common'

export interface FloGridListModuleConfig {
  readonly defaultViewcount: number
}

export const DEFAULT_FLO_GRID_LIST_VIEWCOUNT = 1

export function defaultFloGridListGuidGenerator() {
  return () =>
    ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11)
      // tslint:disable-next-line: no-bitwise
      .replace(/[018]/g, (c: any) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
}

@NgModule({
  imports: [CommonModule],
  declarations: [
    FloGridListComponent,
    FloGridTilesComponent,
    FloGridListItemDirective
  ],
  exports: [
    FloGridListComponent,
    FloGridTilesComponent,
    FloGridListItemDirective
  ],
  providers: [
    {
      provide: FLO_GRID_LIST_VIEWCOUNT,
      useValue: DEFAULT_FLO_GRID_LIST_VIEWCOUNT
    },
    {
      provide: FLO_GRID_LIST_GUID_GEN,
      useFactory: defaultFloGridListGuidGenerator
    }
  ]
})
export class FloGridListModule {
  static config(cfg: Partial<FloGridListModuleConfig> = {}): ModuleWithProviders {
    return {
      ngModule: FloGridListModule,
      providers: [
        {
          provide: FLO_GRID_LIST_VIEWCOUNT,
          useValue: cfg.defaultViewcount || DEFAULT_FLO_GRID_LIST_VIEWCOUNT
        }
      ]
    }
  }
}
