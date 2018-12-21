import { TestBed } from '@angular/core/testing'
import { PwaService } from './pwa.service'
import { ServiceWorkerModule } from '@angular/service-worker'
import { WINDOW } from '@flosportsinc/ng-universal-services/window'

describe('PwaService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      ServiceWorkerModule.register('')
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
