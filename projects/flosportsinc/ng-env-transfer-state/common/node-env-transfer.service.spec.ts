import { TestBed } from '@angular/core/testing'
import { NodeEnvTransferService } from './node-env-transfer.service'
import { FloNodeEnvTransferModule } from './node-env-transfer.common.module'
import { ENV } from './node-env-transfer.tokens'

interface OurConfig {
  readonly someProperty: number
}

describe(NodeEnvTransferService.name, () => {
  afterEach(() => TestBed.resetTestingModule())

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloNodeEnvTransferModule],
      providers: [
        {
          provide: ENV,
          useValue: {
            someProperty: 123
          }
        }
      ]
    })
  })

  it('should construct with correct default values', () => {
    const nts = TestBed.get(NodeEnvTransferService) as NodeEnvTransferService<OurConfig>
    expect(nts.env).toEqual({ someProperty: 123 })
  })
})
