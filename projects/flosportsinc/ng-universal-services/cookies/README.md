# Angular Universal Cookies
Interface with cookies the same way on both the server and browser.

## Installation
This module lives alongside others in our `ng-universal-services` package. If you haven't already done so, install it:
```sh
npm i @flosportsinc/ng-universal-services
``` 

### Browser
You will also need to `npm i js-cookie`.

Inside your `BrowserModule` install `CookieBrowserModule` like so:

```ts
import { NgModule } from '@angular/core'
import { CookieBrowserModule } from '@flosportsinc/ng-universal-services/cookies/browser'

@NgModule({
  imports: [
    CookieBrowserModule
  ]
})
export class AppBrowserModule { }
```

### Server
Inside your `ServerModule` install `CookieServerModule` like so:

```ts
import { NgModule } from '@angular/core'
import { CookieServerModule } from '@flosportsinc/ng-universal-services/cookies/server'

@NgModule({
  imports: [
    CookieServerModule
  ]
})
export class AppServerModule { }
```

Inside your express server be sure setup `cookie-parser`.
```ts
import * as express from 'express'
import * as cookies from 'cookie-parser'

const app = express()
app.use(cookies())
```

## Usage
```ts
import { Inject } from '@angular/core'
import { COOKIE_SERVICE, ICookieService } from '@flosportsinc/ng-universal-services/cookies'

export class SomeThingComponent {
  constructor(@Inject(COOKIE_SERVICE) cs: ICookieService) {
    cs.set('mycookie', 'my awesome cookie value')
  }
}
```