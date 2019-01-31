# Ad-Block Detection Service
Provides a service to detect if an ad-blocker is in use.

## Installation
```sh
npm i @flosportsinc/ng-ad-block
```

Inside your `BrowserModule` (or `AppModule` if you are not using a universal server) install `AdBlockBrowserModule` like so:

```js
import { NgModule } from '@angular/core'
import { AdBlockBrowserModule } from '@flosportsinc/ng-universal-services/ad-block'

@NgModule({
  imports: [
    AdBlockBrowserModule.usingUrl('http://mysite.com/ads.js')
  ]
})
export class AppBrowserModule { }
```

You will need to provide an API endpoint that return a simple 200 response object. In this example we use "http://mysite.com/ads.js". It is important to have the word "ad" somewhere in the url.

If you have a Universal app you will need to include the `AdBlockServerModule` in `AppServerModule` like so:

```js
import { NgModule } from '@angular/core'
import { AdBlockServerModule } from '@flosportsinc/ng-universal-services/ad-block'

@NgModule({
  imports: [
    AdBlockServerModule
  ]
})
export class AppServerModule { }
```