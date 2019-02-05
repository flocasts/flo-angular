import { TestBed } from '@angular/core/testing'
import { NODE_ENV, ENV, ENV_CONFIG_SERVER } from './node-env-transfer.tokens'
import { APP_BOOTSTRAP_LISTENER } from '@angular/core'
import { TransferState } from '@angular/platform-browser'
import { NodeEnvTransferServerModule, INodeEnvTransferServerModuleConfig, nodeEnvFactory } from './node-env-transfer.server.module'

const defNode = { cool_key: 'cool value!' }

const setupTestBed =
  (nodeProcess?: Object) =>
    (config?: Partial<INodeEnvTransferServerModuleConfig>) => {
      const ServerModule = config
        ? NodeEnvTransferServerModule.config(config)
        : NodeEnvTransferServerModule
      TestBed.configureTestingModule({
        imports: [ServerModule],
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
    setupTestBed(defNode)({})
    expect(TestBed.get(ENV_CONFIG_SERVER).selectKeys.length).toEqual(0)
  })

  it('should pluck nonde by default B', () => {
    setupTestBed(defNode)()
    expect(TestBed.get(ENV_CONFIG_SERVER).selectKeys.length).toEqual(0)
  })

  it('should pluck keys', () => {
    setupTestBed(defNode)({ selectKeys: ['cool_key'] })
    const toPluck = TestBed.get(ENV_CONFIG_SERVER).selectKeys
    const env = TestBed.get(ENV)

    expect(toPluck.length).toEqual(1)
    expect(toPluck).toContain('cool_key')
    expect(env).toEqual({ cool_key: 'cool value!' })
  })

  it('should bootstrap and set transfer state', () => {
    setupTestBed(defNode)({ selectKeys: ['cool_key'] })

    const factory = TestBed.get(APP_BOOTSTRAP_LISTENER)[0]
    const ts = TestBed.get(TransferState) as TransferState
    const spyTs = spyOn(ts, 'set').and.callThrough()

    factory()

    expect(spyTs).toHaveBeenCalledWith('NODE_ENV', { cool_key: 'cool value!' })
  })

  it('handle default filter case', () => {
    setupTestBed()()
    expect(TestBed.get(ENV_CONFIG_SERVER)).toBeTruthy()
  })

  it('handle default filter case', () => {
    expect(nodeEnvFactory()).toEqual({})
  })

  it('should selecte by pattern', () => {
    setupTestBed({
      NODE_ENV_VAR: 'SOMETHING',
      FLO_SERVER_API: 'https://url.ref',
      FLO_SERVER_API2: 'https://url.ref2'
    })({
      extractor: new RegExp('FLO_')
    })

    const env = TestBed.get(ENV)

    expect(Object.keys(env).length).toEqual(2)
    expect(env.FLO_SERVER_API).toEqual('https://url.ref')
    expect(env.FLO_SERVER_API2).toEqual('https://url.ref2')
  })

  it('should selecte by pattern and rename key', () => {
    setupTestBed({
      NODE_ENV_VAR: 'SOMETHING',
      FLO_SERVER_API: 'https://url.ref',
      FLO_SERVER_API2: 'https://url.ref2'
    })({
      extractor: new RegExp('FLO_'),
      keyReplacer: key => key.replace('FLO_', '')
    })

    const env = TestBed.get(ENV)

    expect(Object.keys(env).length).toEqual(2)
    expect(env.SERVER_API).toEqual('https://url.ref')
    expect(env.SERVER_API2).toEqual('https://url.ref2')
  })


  it('should handle combination of selectedKeys + extractor pattern', () => {
    const testEnv = { NODE_ENV_VAR: 'SOMETHING', FLO_SERVER_API: 'https://url.ref' }
    setupTestBed(testEnv)({
      selectKeys: ['NODE_ENV_VAR'],
      extractor: new RegExp('FLO_')
    })

    const env = TestBed.get(ENV)
    expect(env).toEqual(testEnv)
  })

  it('should have default regex pattern matcher of undefined', () => {
    setupTestBed()()

    expect(TestBed.get(ENV_CONFIG_SERVER).extractor).toBeUndefined()
  })
})
