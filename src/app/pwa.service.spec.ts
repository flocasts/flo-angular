import { TestBed } from '@angular/core/testing'
import { PwaService } from './pwa.service'
import { ServiceWorkerModule } from '@angular/service-worker'

describe('PwaService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      ServiceWorkerModule.register('')
    ]
  }))

  it('should be created', () => {
    const service: PwaService = TestBed.get(PwaService)
    expect(service).toBeTruthy()
  })
})
