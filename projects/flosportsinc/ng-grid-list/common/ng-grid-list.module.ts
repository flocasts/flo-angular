import { NgModule, ModuleWithProviders } from '@angular/core'
import { FloGridTilesComponent } from './grid-tiles/grid-tiles.component'
import { FloGridListComponent, FloGridListItemDirective } from './grid-list/grid-list.component'
import { CommonModule } from '@angular/common'
import { FLO_GRID_LIST_VIEWCOUNT } from './tokens'

export interface FloGridListModuleConfig {
  readonly defaultViewcount: number
}

export const DEFAULT_FLO_GRID_LIST_VIEWCOUNT = 1

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
