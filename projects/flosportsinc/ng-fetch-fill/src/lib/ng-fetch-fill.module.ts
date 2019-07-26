import { NgModule } from '@angular/core'
import { FloFetchFillDirective, FloFetchFillItemDirective } from './ng-fetch-fill.directive'

@NgModule({
  imports: [],
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
