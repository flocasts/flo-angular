import { NgModule } from '@angular/core'
import { SVG_LOADER } from './svg-transfer-state.tokens'
import { SvgBrowserLoaderService } from './svg-transfer-state.browser.service'

@NgModule({
  providers: [
    {
      provide: SVG_LOADER,
      useClass: SvgBrowserLoaderService
    }
  ]
})
export class SvgTransferStateBrowserModule { }
