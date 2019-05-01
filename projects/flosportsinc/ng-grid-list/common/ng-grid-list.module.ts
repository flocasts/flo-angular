import { NgModule } from '@angular/core'
import { FloGridTilesComponent } from './grid-tiles/grid-tiles.component'
import { FloGridListComponent } from './grid-list/grid-list.component'

@NgModule({
  declarations: [
    FloGridListComponent,
    FloGridTilesComponent
  ],
  exports: [
    FloGridListComponent,
    FloGridTilesComponent
  ]
})
export class FloGridListModule { }
