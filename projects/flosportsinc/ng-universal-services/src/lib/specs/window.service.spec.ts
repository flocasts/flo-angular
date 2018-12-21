import { TestBed } from '@angular/core/testing'
import { WindowService } from '../../../window/src/lib/window.service'
import { WINDOW } from '../../../window/src/lib/window.tokens'

describe('WindowService', () => {
  afterEach(() => TestBed.resetTestingModule())

  it('should be created with default window from test environment', () => {
    TestBed.configureTestingModule({
      providers: [{
        provide: WINDOW,
        useValue: window
      }]
    })
    const service: WindowService = TestBed.get(WindowService)
    expect(service).toBeTruthy()
  })

  it('should be created with window token', () => {
    TestBed.configureTestingModule({
      providers: [
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
})
