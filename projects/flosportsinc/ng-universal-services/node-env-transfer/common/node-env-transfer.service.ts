import { Inject, Injectable } from '@angular/core'
import { ENV_CONFIG } from './node-env-transfer.tokens'

export interface INodeEnvTransferService<T> {
  readonly env: T
}

@Injectable()
export class NodeEnvTransferService<T> implements INodeEnvTransferService<T> {
  constructor(@Inject(ENV_CONFIG) private _env: any) { }
  public readonly env: T = this._env
}
