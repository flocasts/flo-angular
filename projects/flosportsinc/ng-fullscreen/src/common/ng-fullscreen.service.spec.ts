import { TestBed, async } from '@angular/core/testing'
import { FloFullscreenService } from './ng-fullscreen.service'
import { FloFullscreenCommonModule } from './ng-fullscreen.module'
import { PLATFORM_ID } from '@angular/core';
import { take, skip } from 'rxjs/operators';

describe(FloFullscreenService.name, () => {
  // tslint:disable-next-line: no-let
  let service: FloFullscreenService

  const setService = () => service = TestBed.get(FloFullscreenService)

  describe('when on platform browser', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FloFullscreenCommonModule],
        providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
      })
      setService()
    })

    afterEach(() => TestBed.resetTestingModule())

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('should return false true fullscreenIsSupported', async(() => {
      setService()
      expect(service.fullscreenIsSupported()).toEqual(true)
    }))
  })

  describe('when on platform server', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FloFullscreenCommonModule],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }]
      })
      setService()
    })

    afterEach(() => TestBed.resetTestingModule())

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('should return false from canGoFullscreen', async(() => {
      setService()
      service.canGoFullscreen$.subscribe(val => {
        expect(val).toEqual(false)
      })
    }))

    it('should return false from fullscreenIsSupported', async(() => {
      setService()
      expect(service.fullscreenIsSupported()).toEqual(false)
    }))
  })
})
