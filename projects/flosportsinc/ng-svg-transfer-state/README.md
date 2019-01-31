# Angular Universal SVG Transfer State
Seamlessly transfer SVG data from server to browser.

## Installation
```sh
npm i @flosportsinc/ng-svg-transfer-state
```

## Table of Contents

- [App Setup](/projects/flosportsinc/ng-svg-transfer-state#app)
- [Browser Setup](#browser)
- [Server Setup](#server)
- [Caching Setup](#caching)
- [Usage](#usage)
- [Customization](#customization)

### App
Inside your `AppModule` install `SvgTransferStateModule` like so:

```js
import { NgModule } from '@angular/core'
import { SvgTransferStateModule } from '@flosportsinc/ng-universal-services/svg-transfer-state'

@NgModule({
  imports: [
    SvgTransferStateModule, // for default configuration { styles: { height: '18px' }, parentStyleKeys: ['height', 'width'] }
    SvgTransferStateModule.config({ // or use your own custom settings
      styles: { height: '48px', fill: 'green' },
      parentStyleKeys: ['height'] // the container element (ex: <i>, <span>, etc) will also get these styles applied to it.
    })
  ]
})
export class AppBrowserModule { }
```

### Browser
Inside your `BrowserModule` (or `AppModule` if you are not using a universal server) install `SvgTransferStateBrowserModule` like so:

```js
import { NgModule } from '@angular/core'
import { SvgTransferStateBrowserModule } from '@flosportsinc/ng-universal-services/svg-transfer-state/browser'

@NgModule({
  imports: [
    SvgTransferStateBrowserModule, // with default root (defaults to "assets/svg")
    SvgTransferStateBrowserModule.withConfig({
      dir: 'public/assets/svg', // with custom root
      cacheMaxAge: 1000 * 60 * 60 * 24 * 7 // will cache in user's localstorage for 7 days, by default cache is only per session.
    }) 
  ]
})
export class AppBrowserModule { }
```

### Server
If you have a Universal app you will need to include the `SvgTransferStateServerModule` in `AppServerModule` like so:

```js
import { NgModule } from '@angular/core'
import { SvgTransferStateServerModule } from '@flosportsinc/ng-universal-services/svg-transfer-state/server'

// To customize the director where your SVG assets live on the node server use .withSvgAssetRoot()
// By default it sets the root directory to "./dist/assets/svg"

@NgModule({
  imports: [
    SvgTransferStateServerModule, // with default root (defaults to "./dist/assets/svg")
    SvgTransferStateServerModule.withSvgAssetRoot('dist/flo-angular/browser/assets/svg') // with custom root
  ]
})
export class AppServerModule { }
```

## Caching
Both the server and client can cache http and file lookup requests.

### Server Caching
```js
// server.ts (your node.js express server)

// this example uses the npm package "lru-cache"
// npm install lru-cache @types/lru-cache

import { ngExpressEngine } from '@nguniversal/express-engine'
import { SVG_SERVER_CACHE } from '@flosportsinc/ng-universal-services/svg-transfer-state'
import * as lru from 'lru-cache' // it is not required to use this specific package

// it is imperative that the DI token for the cache is injected in the node server itself
// not from within the angular application. Otherwise a new cache would be spawned each time
// and the values would not be shared globally accross requests - defeating the purpose

// By providing a cache object, both externally fetched SVGs and local file svgs will be cached
// this should dramatically reduce server load time as no network or readFile requests are made if the
// svg is cached.

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    {
      provide: SVG_SERVER_CACHE,
      useValue: new lru({ maxAge: 1000 * 60 * 60 }) // cache is bypassed if the last cache write has expired.
    }
  ]
}))
```

### Client Caching

## Usage

### _Simplest usage with default settings applied_
```html
<i floSvg="twitter"></i>
```

### _With applied styles_
```html
<!-- recommend placing settings object in typescript component controller instead of inlining -->
<i floSvg="twitter" [floSvgStyles]="{ fill: 'blue', height: '72px' }"></i>
```

### _With external sources_
```html
<!-- make sure CORS headers are legit and proper XML is returned -->
<i floSvg="https://my-awesome-icon.svg"></i>
```

## Customization
TODO