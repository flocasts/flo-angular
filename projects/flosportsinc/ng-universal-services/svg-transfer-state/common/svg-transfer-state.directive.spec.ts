import { TestBed } from '@angular/core/testing'
import { SvgTransferStateModule } from './svg-transfer-state.module'

const setupTb = () => {
  TestBed.configureTestingModule({
    imports: [SvgTransferStateModule]
  })
}

describe('Window Module', () => {
  afterEach(() => TestBed.resetTestingModule())

  it('should... ', () => {
    setupTb()
    // const service: WindowService = TestBed.get(WindowService)
    // expect(service).toBeTruthy()
  })
})
