import { NgModule, ModuleWithProviders } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { AD_BLOCK_PING_URL } from './ad-block.tokens'
import { AdBlockService } from './ad-block.service'

@NgModule({
  imports: [HttpClientModule],
})
export class AdBlockBrowserModule {
  static usingUrl(url: string): ModuleWithProviders {
    return {
      ngModule: AdBlockBrowserModule,
      providers: [
        {
          provide: AD_BLOCK_PING_URL,
          useValue: url
        },
        AdBlockService
      ]
    }
  }
}
