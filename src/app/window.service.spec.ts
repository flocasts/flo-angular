import { TestBed } from '@angular/core/testing'
import { WindowService, WINDOW } from './window.service'

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
          useValue: window
        }
      ]
    })
    const service: WindowService = TestBed.get(WindowService)
    expect(service).toBeTruthy()
  })
})
