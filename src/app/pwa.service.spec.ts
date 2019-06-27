import { TestBed } from '@angular/core/testing'
import { PwaService } from './pwa.service'
import { ServiceWorkerModule } from '@angular/service-worker'
import { WINDOW, FloWindowModule } from '@flosportsinc/ng-window'

describe('PwaService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      FloWindowModule,
      ServiceWorkerModule.register('', { enabled: false })
    ],
    providers: [
      {
        provide: WINDOW,
        useValue: window
      }
    ]
  }))

  it('should be created', () => {
    const service: PwaService = TestBed.get(PwaService)
    expect(service).toBeTruthy()
  })
})
