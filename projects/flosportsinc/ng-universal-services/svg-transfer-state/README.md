# Angular Universal SVG Transfer State
Seamlessly transfer SVG data from server to browser.

## Installation
This module lives alongside others in our `ng-universal-services` package. If you haven't already done so, install it:
```sh
npm i @flosportsinc/ng-universal-services
```

## Table of Contents

- [App Setup](#app)
- [Browser Setup](#browser)
- [Server Setup](#server)
- [Usage](#usage)
- [Customization](#customization)

### App
Inside your `AppModule` install `SvgTransferStateModule` like so:

```ts
import { NgModule } from '@angular/core'
import { SvgTransferStateModule } from '@flosportsinc/ng-universal-services/svg-transfer-state'

@NgModule({
  imports: [
    SvgTransferStateModule, // for default configuration { styles: { height: '18px' }, parentStyleKeys: ['height', 'width'] }
    SvgTransferStateModule.config({ // or use your own custom settings
      styles: { height: '48px', fill: 'green' },
      parentStyleKeys: ['height']
    })
  ]
})
export class AppBrowserModule { }
```

### Browser
Inside your `BrowserModule` (or `AppModule` if you are not using a universal server) install `SvgTransferStateBrowserModule` like so:

```ts
import { NgModule } from '@angular/core'
import { SvgTransferStateBrowserModule } from '@flosportsinc/ng-universal-services/svg-transfer-state/browser'

@NgModule({
  imports: [
    SvgTransferStateBrowserModule, // with default root (defaults to "assets/svg")
    SvgTransferStateBrowserModule.withSvgAssetRoot('') // with custom root
  ]
})
export class AppBrowserModule { }
```

### Server
If you have a Universal app you will need to include the `SvgTransferStateServerModule` in `AppServerModule` like so:

```ts
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