import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FloFetchFillItemDirective } from './ng-fetch-fill-item.directive'
import { FloFetchFillDirective } from './ng-fetch-fill.directive'

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
  ]
})
export class FloFetchFillModule { }
