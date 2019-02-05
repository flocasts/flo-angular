import { NodeEnvTransferBrowserModule, INodeEnvTransferBrowserModuleConfig } from './node-env-transfer.browser.module'
import { TestBed } from '@angular/core/testing'
import { ENV, ENV_CONFIG_TS_KEY } from './node-env-transfer.tokens'
import { TransferState } from '@angular/platform-browser'

const setupTestBed = (config?: INodeEnvTransferBrowserModuleConfig) => {
  TestBed.configureTestingModule({
    imports: [
      NodeEnvTransferBrowserModule.config(config)
    ]
  })
}

describe(NodeEnvTransferBrowserModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  it('should construct with correct default values', () => {
    setupTestBed()
    const ts = TestBed.get(TransferState) as TransferState
    const stateKey = TestBed.get(ENV_CONFIG_TS_KEY)
    const spyTs = spyOn(ts, 'get').and.callThrough()

    expect(TestBed.get(ENV)).toEqual({})
    expect(stateKey).toEqual('NODE_ENV')
    expect(spyTs).toHaveBeenCalledWith('NODE_ENV', {})
  })

  it('should ...', () => {
    setupTestBed({ mergeWithServer: { test: '1' } })

    expect(TestBed.get(ENV)).toEqual({ test: '1' })
  })

  it('should merge server transferred values', () => {
    setupTestBed({ mergeWithServer: { test: '1' } })

    const ts = TestBed.get(TransferState) as TransferState
    spyOn(ts, 'get').and.returnValue({ FROM_SERVER: true })

    expect(TestBed.get(ENV)).toEqual({
      FROM_SERVER: true,
      test: '1'
    })
  })
})
