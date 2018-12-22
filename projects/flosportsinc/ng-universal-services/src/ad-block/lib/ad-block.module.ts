import { NgModule, ModuleWithProviders } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { AD_BLOCK_PING_URL } from './ad-block.tokens'

@NgModule({
  imports: [HttpClientModule],
})
export class AdBlockModule {
  static withTestUrl(url: string): ModuleWithProviders {
    return {
      ngModule: AdBlockModule,
      providers: [{
        provide: AD_BLOCK_PING_URL,
        useValue: url
      }]
    }
  }
}
