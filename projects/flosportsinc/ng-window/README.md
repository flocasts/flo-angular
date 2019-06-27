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
import { FloWindowModule } from '@flosportsinc/ng-window'

@NgModule({
  imports: [
    FloWindowModule
  ]
})
export class AppModule { }
```

### Server
Inside your `AppModule` install `WindowModule` like so:

```js
import { NgModule } from '@angular/core'
import { FloWindowServerModule } from '@flosportsinc/ng-window/server'

@NgModule({
  imports: [
    FloWindowServerModule
  ]
})
export class AppServerModule { }
```

### Usage