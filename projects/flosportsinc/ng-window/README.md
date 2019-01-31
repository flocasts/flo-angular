# Angular Universal Window Module
For use in unit testing and Angular Universal applications.

## Installation
```sh
npm i @flosportsinc/ng-window
```

### App
Inside your `AppModule` install `WindowModule` like so:

```js
import { NgModule } from '@angular/core'
import { WindowModule } from '@flosportsinc/ng-window'

@NgModule({
  imports: [
    WindowModule
  ]
})
export class AppModule { }
```

### Server
Inside your `AppModule` install `WindowModule` like so:

```js
import { NgModule } from '@angular/core'
import { WindowServerModule } from '@flosportsinc/ng-window/server'

@NgModule({
  imports: [
    WindowServerModule
  ]
})
export class AppServerModule { }
```

### Usage