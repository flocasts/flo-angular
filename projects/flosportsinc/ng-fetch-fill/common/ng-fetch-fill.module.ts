import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FloFetchFillItemDirective } from './ng-fetch-fill-item.directive'
import { FloFetchFillDirective } from './ng-fetch-fill.directive'
import { FS_FETCH_FILL_DEBOUNCE } from './ng-fetch-fill.tokens'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FloFetchFillDirective,
    FloFetchFillItemDirective
  ],
  exports: [
    FloFetchFillDirective,
    FloFetchFillItemDirective
  ],
  providers: [
    { provide: FS_FETCH_FILL_DEBOUNCE, useValue: 200 }
  ]
})
export class FloFetchFillModule { }
