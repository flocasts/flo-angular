# Angular Universal Node Environment Transfer
Transfer server side environment variables to use as configuration values throughout the application.

## Installation
```sh
npm i @flosportsinc/ng-env-transfer-state
```

Inside your `BrowserModule` install `NodeEnvTransferBrowserModule` like so:

```ts
import { NgModule } from '@angular/core'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'

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
import { NodeEnvTransferServerModule } from '@flosportsinc/ng-env-transfer-state/server'

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