import { TestBed } from '@angular/core/testing'
import { ENV_CONFIG_TS_KEY } from './node-env-transfer.tokens'
import { NodeEnvTransferCommonModule } from './node-env-transfer.common.module'

describe(NodeEnvTransferCommonModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NodeEnvTransferCommonModule]
    })
  })

  it('should construct with correct default values', () => {
    const stateKey = TestBed.get(ENV_CONFIG_TS_KEY)
    expect(stateKey).toEqual('NODE_ENV')
  })
})
