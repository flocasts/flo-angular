import { Inject, Injectable } from '@angular/core'
import { ENV } from './node-env-transfer.tokens'

export interface INodeEnvTransferService<T> {
  readonly env: T
}

@Injectable()
export class NodeEnvTransferService<T = any> implements INodeEnvTransferService<T> {
  constructor(@Inject(ENV) private _env: any) { }
  public readonly env: T = this._env
}
