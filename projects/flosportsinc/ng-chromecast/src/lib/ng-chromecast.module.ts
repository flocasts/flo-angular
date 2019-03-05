import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FloChromecastComponent } from './ng-chromecast.component'

@NgModule({
  declarations: [FloChromecastComponent],
  exports: [FloChromecastComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FloChromecastModule { }
