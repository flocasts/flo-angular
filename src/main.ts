import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppBrowserModule } from './app/app.browser.module'
import { environment } from './environments/environment'

// tslint:disable-next-line:no-if-statement
if (environment.production) {
  enableProdMode()
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppBrowserModule)
    .catch(console.log)
})
