import { Inject, Injectable } from '@angular/core'
import { ENV_CONFIG } from './node-env-transfer.tokens'

export interface INodeEnvTransferService {
  readonly env: any
}

@Injectable()
export class NodeEnvTransferService implements INodeEnvTransferService {
  constructor(@Inject(ENV_CONFIG) public env: any) { }
}
