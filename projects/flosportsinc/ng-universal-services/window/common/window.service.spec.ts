import { TestBed } from '@angular/core/testing'
import { WindowService } from './window.service'
import { WINDOW } from './window.tokens'
import { WindowModule, winFactory } from './window.common.module'

const setupTb = () => {
  TestBed.configureTestingModule({
    imports: [WindowModule]
  })
}

describe('Window Module', () => {
  afterEach(() => TestBed.resetTestingModule())

  it('should be created with default window from test environment', () => {
    setupTb()
    const service: WindowService = TestBed.get(WindowService)
    expect(service).toBeTruthy()
  })

  it('should be created with default window from test environment', () => {
    setupTb()
    const service: WindowService = TestBed.get(WindowService)
    expect(service).toBeTruthy()
  })

  it('should be created with window token', () => {
    TestBed.configureTestingModule({
      providers: [
        WindowService,
        {
          provide: WINDOW,
          useValue: { test: 1 }
        }
      ]
    })
    const service: WindowService = TestBed.get(WindowService)
    expect(service).toBeTruthy()
    expect(service.window()).toEqual({ test: 1 })
  })

  it('should return empty object when window is not defined', () => {
    expect(winFactory(false)).toEqual({})
  })
})
