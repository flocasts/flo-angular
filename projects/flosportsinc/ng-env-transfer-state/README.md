# Angular Universal Node Environment Transfer
Transfer server side environment variables to use as configuration values throughout the application.

## Installation
```sh
npm i @flosportsinc/ng-env-transfer-state
```

Inside your `AppModule` install `NodeEnvTransferModule` like so:

```js
import { NgModule } from '@angular/core'
import { FloNodeEnvTransferModule } from '@flosportsinc/ng-env-transfer-state'

@NgModule({
  imports: [
    FloNodeEnvTransferModule
  ]
})
export class AppModule { }
```

Inside your `BrowserModule` install `FloNodeEnvTransferBrowserModule` like so:

```js
import { NgModule } from '@angular/core'
import { FloNodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'

@NgModule({
  imports: [
    FloNodeEnvTransferBrowserModule, // default behavior simply return the values passed from Node or an empty object if none are found.
    FloNodeEnvTransferBrowserModule.config({ // you can also merge custom values with server values
      mergeWithServer: {
        MyEnvValue1: true,
        MyEnvValue2: 'string',
        MyEnvValue3: undefined
      }
    })
  ]
})
export class AppBrowserModule { }
```

Inside your `ServerModule` install `FloNodeEnvTransferServerModule` like so:

```js
import { NgModule } from '@angular/core'
import { FloNodeEnvTransferServerModule } from '@flosportsinc/ng-env-transfer-state/server'

@NgModule({
  imports: [
    FloNodeEnvTransferServerModule, // default module passes nothing to the browser
    FloNodeEnvTransferServerModule.config({
      selectKeys: [ // pass all variables listed here if they exist (is merged with pattern matched values from extractor property)
        'my_awesome_env_variable1',
        'my_awesome_env_variable2',
        'npm_config_path'
      ],
      extractor: new RegExp('MY_PREFIX_'), // a regexp to pick the values you want passed to the browser (is merged with pattern matched values from selectKeys property)
      keyReplacer: (key: string) => key.replace('MY_PREFIX_', '') // a function to rename keys. ex: MY_PREFIX_VAR1 => VAR1
    })
  ]
})
export class AppServerModule { }
```

The collection of strings provided inside the `withSelectedKeys` static method will be plucked from `process.env` and transferred to the client. By default variables with a prefix `NG_` are extraced from the server. Please be aware of the security risks involved when selecting environment variables. Do not expose sensitive information.


### Simple Usage
```js
import { Component, Inject } from '@angular/core'
import { ENV } from '@flosportsinc/ng-env-transfer-state'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(@Inject(ENV) env: any) {
    console.log(env)
  }
}
```

### Service Usage
```js
import { Component } from '@angular/core'
import { NodeEnvTransferService } from '@flosportsinc/ng-env-transfer-state'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(nts: NodeEnvTransferService) {
    console.log(nts.env)
  }
}
```

### Service Usage w/ Generic
```js
import { Component } from '@angular/core'
import { NodeEnvTransferService } from '@flosportsinc/ng-env-transfer-state'

interface MyTypedEnv {
  readonly coolValue?: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(nts: NodeEnvTransferService<MyTypedEnv>) {
    console.log(nts.env.coolValue)
  }
}
```