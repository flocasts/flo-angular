import { TestBed } from '@angular/core/testing'
import { ENV_CONFIG_TS_KEY, NODE_ENV_USE_VALUES } from './node-env-transfer.tokens'
import { FloNodeEnvTransferModule } from './node-env-transfer.common.module'

describe(FloNodeEnvTransferModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloNodeEnvTransferModule]
    })
  })

  it('should construct with correct default values', () => {
    const stateKey = TestBed.get(ENV_CONFIG_TS_KEY)
    expect(stateKey).toEqual('NODE_ENV')
  })

  it('should construct with config object', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloNodeEnvTransferModule.config({
        useValues: {
          test: 'a-ok'
        }
      })]
    })
    const sut = TestBed.get(NODE_ENV_USE_VALUES)
    expect(sut).toEqual({ test: 'a-ok' })
  })

  it('should construct with empty config object', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloNodeEnvTransferModule.config()]
    })
    const sut = TestBed.get(NODE_ENV_USE_VALUES)
    expect(sut).toEqual({})
  })
})
