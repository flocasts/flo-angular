import { TestBed } from '@angular/core/testing'
import { ENV_CONFIG_FILTER_KEYS, NODE_ENV, ENV_CONFIG } from './node-env-transfer.tokens'
import { NodeEnvTransferServerModule, serverEnvConfigFactory } from './node-env-transfer.server.module'
import { APP_BOOTSTRAP_LISTENER } from '@angular/core'
import { TransferState } from '@angular/platform-browser'

const setupTestBed =
  (nodeProcess = { cool_key: 'cool value!' }) =>
    (pluckKeys?: ReadonlyArray<string>) => {
      const mod = pluckKeys
        ? pluckKeys.length
          ? NodeEnvTransferServerModule.withSelectedKeys(pluckKeys)
          : NodeEnvTransferServerModule.withSelectedKeys()
        : NodeEnvTransferServerModule
      TestBed.configureTestingModule({
        imports: [mod],
        providers: [{
          provide: NODE_ENV,
          useValue: nodeProcess
        }]
      })
      TestBed.get(APP_BOOTSTRAP_LISTENER)
    }

describe(NodeEnvTransferServerModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  it('should pluck none by default A', () => {
    setupTestBed()([])
    expect(TestBed.get(ENV_CONFIG_FILTER_KEYS).length).toEqual(0)
  })

  it('should pluck nonde by default B', () => {
    setupTestBed()()
    expect(TestBed.get(ENV_CONFIG_FILTER_KEYS).length).toEqual(0)
  })

  it('should pluck keys', () => {
    setupTestBed()(['cool_key'])
    const toPluck = TestBed.get(ENV_CONFIG_FILTER_KEYS)
    const env = TestBed.get(ENV_CONFIG)

    expect(toPluck.length).toEqual(1)
    expect(toPluck).toContain('cool_key')
    expect(env).toEqual({ cool_key: 'cool value!' })
  })

  it('should bootstrap and set transfer state', () => {
    setupTestBed()(['cool_key'])

    const factory = TestBed.get(APP_BOOTSTRAP_LISTENER)[0]
    const ts = TestBed.get(TransferState) as TransferState
    const spyTs = spyOn(ts, 'set').and.callThrough()

    factory()

    expect(spyTs).toHaveBeenCalledWith('NODE_ENV', { cool_key: 'cool value!' })
  })

  it('handle default filter case', () => {
    expect(serverEnvConfigFactory(undefined, [])).toEqual({})
  })
})
