import { NgModule } from '@angular/core'
import { SVG_LOADER } from './svg-transfer-state.tokens'
import { SvgServerLoaderService } from './svg-transfer-state.server.service'

@NgModule({
  providers: [
    {
      provide: SVG_LOADER,
      useClass: SvgServerLoaderService
    }
  ]
})
export class SvgTransferStateServerModule { }
