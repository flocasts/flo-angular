import { TestBed } from '@angular/core/testing'
import { NODE_ENV, ENV, ENV_CONFIG_SERVER_SELECTED, ENV_CONFIG_SERVER_EXTRACTOR } from './node-env-transfer.tokens'
import {
  NodeEnvTransferServerModule, INodeEnvTransferServerModuleConfig, nodeEnvFactory,
  DEFAULT_ENV_CONFIG_EXTRACTOR,
  serverEnvConfigFactory,
  defaultReplaceExtract,
  DEFAULT_ENV_CONFIG_FILTER_KEYS
} from './node-env-transfer.server.module'

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
    }

describe(NodeEnvTransferServerModule.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  it('should pluck none by default A', () => {
    setupTestBed(defNode)({})
    expect(TestBed.get(ENV_CONFIG_SERVER_SELECTED).length).toEqual(0)
  })

  it('should pluck nonde by default B', () => {
    setupTestBed(defNode)()
    expect(TestBed.get(ENV_CONFIG_SERVER_SELECTED).length).toEqual(0)
  })

  it('should pluck keys', () => {
    setupTestBed(defNode)({ selectKeys: ['cool_key'] })
    const toPluck = TestBed.get(ENV_CONFIG_SERVER_SELECTED)
    const env = TestBed.get(ENV)

    expect(toPluck.length).toEqual(1)
    expect(toPluck).toContain('cool_key')
    expect(env).toEqual({ cool_key: 'cool value!' })
  })

  it('should ignore non-functions passed as replacer settting', () => {
    const sut1 = serverEnvConfigFactory({ NG_KEY1: '1' }, {}, ['NG_KEY1'], '', 'thing' as any)
    const sut2 = serverEnvConfigFactory({ NG_KEY1: '1' }, {}, ['NG_KEY1'], '', defaultReplaceExtract('NG_'))
    expect(sut1).toEqual({ NG_KEY1: '1' })
    expect(sut2).toEqual({ KEY1: '1' })
  })

  it('should use defaults when .config is called but not used', () => {
    TestBed.configureTestingModule({
      imports: [NodeEnvTransferServerModule.config()]
    })

    expect(TestBed.get(ENV_CONFIG_SERVER_EXTRACTOR)).toEqual(DEFAULT_ENV_CONFIG_EXTRACTOR)
    expect(TestBed.get(ENV_CONFIG_SERVER_SELECTED)).toEqual(DEFAULT_ENV_CONFIG_FILTER_KEYS)
  })

  it('handle default filter case', () => {
    expect(nodeEnvFactory()).toEqual({})
  })

  it('merge useValues property', () => {
    setupTestBed({
      NODE_ENV_VAR: 'SOMETHING',
      FLO_SERVER_API: 'https://url.ref',
      FLO_SERVER_API2: 'https://url.ref2',
    })({
      useValues: {
        THIS_IS_ME: 'Yay!',
        DUDE: 'Sweeeet!'
      },
      extractor: 'FLO_'
    })

    const env = TestBed.get(ENV)

    expect(Object.keys(env).length).toEqual(4)
    expect(env.SERVER_API).toEqual('https://url.ref')
    expect(env.SERVER_API2).toEqual('https://url.ref2')
    expect(env.THIS_IS_ME).toEqual('Yay!')
    expect(env.DUDE).toEqual('Sweeeet!')
  })

  it('should select by pattern', () => {
    setupTestBed({
      NODE_ENV_VAR: 'SOMETHING',
      FLO_SERVER_API: 'https://url.ref',
      FLO_SERVER_API2: 'https://url.ref2'
    })({
      extractor: 'FLO_'
    })

    const env = TestBed.get(ENV)

    expect(Object.keys(env).length).toEqual(2)
    expect(env.SERVER_API).toEqual('https://url.ref')
    expect(env.SERVER_API2).toEqual('https://url.ref2')
  })

  it('should selecte by pattern and rename key', () => {
    setupTestBed({
      NODE_ENV_VAR: 'SOMETHING',
      FLO_SERVER_API: 'https://url.ref',
      FLO_SERVER_API2: 'https://url.ref2'
    })({
      extractor: 'FLO_'
    })

    const env = TestBed.get(ENV)

    expect(Object.keys(env).length).toEqual(2)
    expect(env.SERVER_API).toEqual('https://url.ref')
    expect(env.SERVER_API2).toEqual('https://url.ref2')
  })


  it('should handle combination of selectedKeys + extractor pattern', () => {
    const testEnv = { NODE_ENV_VAR: 'SOMETHING', NG_SERVER_API: 'https://url.ref' }
    const testEnRes = { NODE_ENV_VAR: 'SOMETHING', SERVER_API: 'https://url.ref' }
    setupTestBed(testEnv)({
      selectKeys: ['NODE_ENV_VAR'],
      extractor: 'NG_'
    })

    const env = TestBed.get(ENV)
    expect(env).toEqual(testEnRes)
  })

  it('should have default regex pattern matcher of undefined', () => {
    setupTestBed()()

    expect(TestBed.get(ENV_CONFIG_SERVER_EXTRACTOR)).toEqual(DEFAULT_ENV_CONFIG_EXTRACTOR)
  })
})
