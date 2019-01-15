# Angular Universal Node Environment Transfer
Transfer server side environment variables to use as configuration values throughout the application.

## Installation
This module lives alongside others in our `ng-universal-services` package. If you haven't already done so, install it:
```sh
npm i @flosportsinc/ng-universal-services
```

Inside your `BrowserModule` install `NodeEnvTransferBrowserModule` like so:

```ts
import { NgModule } from '@angular/core'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-universal-services/node-env-transfer/browser'

@NgModule({
  imports: [
    NodeEnvTransferBrowserModule
  ]
})
export class AppBrowserModule { }
```

Inside your `ServerModule` install `NodeEnvTransferServerModule` like so:

```ts
import { NgModule } from '@angular/core'
import { NodeEnvTransferServerModule } from '@flosportsinc/ng-universal-services/node-env-transfer/server'

@NgModule({
  imports: [
    NodeEnvTransferServerModule.withSelectedKeys([
      'my_awesome_env_variable1',
      'my_awesome_env_variable2',
      'npm_config_path'
    ])
  ]
})
export class AppServerModule { }
```

The collection of strings provided inside the `withSelectedKeys` static method will be plucked from `process.env` and transferred to the client. By default none are provided. Please be aware of the security risks involved when selecting environment variables. Do not expose sensitive information.