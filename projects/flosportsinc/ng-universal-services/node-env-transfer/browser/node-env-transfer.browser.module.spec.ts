import { NodeEnvTransferBrowserModule } from './node-env-transfer.browser.module'
import { TestBed } from '@angular/core/testing'
import { ENV_CONFIG, ENV_CONFIG_TS_KEY } from './node-env-transfer.tokens'
import { TransferState } from '@angular/platform-browser'

describe(NodeEnvTransferBrowserModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NodeEnvTransferBrowserModule]
    })
  })

  it('should construct with correct default values', () => {
    const ts = TestBed.get(TransferState) as TransferState
    const stateKey = TestBed.get(ENV_CONFIG_TS_KEY)
    const spyTs = spyOn(ts, 'get').and.callThrough()

    expect(TestBed.get(ENV_CONFIG)).toBeTruthy()
    expect(stateKey).toEqual('NODE_ENV')
    expect(spyTs).toHaveBeenCalledWith('NODE_ENV', {})
  })
})
