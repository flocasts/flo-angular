import { TestBed, async, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing'
import { FloFullscreenService } from './ng-fullscreen.service'
import { FloFullscreenCommonModule } from './ng-fullscreen.module'
import { PLATFORM_ID } from '@angular/core'
import { take, skip } from 'rxjs/operators'
import { DOCUMENT } from '@angular/common'
import { FS_FULLSCREEN_ENABLED } from './ng-fullscreen.tokens'

describe(FloFullscreenService.name, () => {
  // tslint:disable-next-line: no-let
  let service: FloFullscreenService

  const setService = () => service = TestBed.get(FloFullscreenService)

  describe('when on platform browser', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FloFullscreenCommonModule],
        providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
      })
      setService()
    }))

    afterEach(() => TestBed.resetTestingModule())

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('should return false true fullscreenIsSupported', async(() => {
      service.fullscreenIsSupported().subscribe(res => expect(res).toEqual(true))
    }))

    // it('should default fullscreen obs', done => {
    //   service.fullscreen$.pipe(take(1)).subscribe(c => {
    //     expect(c).toEqual(false)
    //     done()
    //   })
    // })

    it('should return true obs when in fullscreen', done => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [FloFullscreenCommonModule],
        providers: [{
          provide: DOCUMENT, useValue: {
            fullscreenElement: true
          }
        }]
      })
      setService()
      service.fullscreen$.pipe(take(1)).subscribe(c => {
        expect(c).toEqual(true)
        done()
      })
    })

    it('isFullscreen$ should return true', done => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [FloFullscreenCommonModule],
        providers: [{
          provide: DOCUMENT, useValue: {
            fullscreenElement: true
          }
        }]
      })
      setService()

      expect(service.isFullscreen(TestBed.get(DOCUMENT))).toEqual(true)

      service.isFullscreen$.pipe(take(1)).subscribe(c => {
        expect(c).toEqual(true)
        done()
      })
    })

    it('should request fullscreen on a default element', () => {
      const doc = TestBed.get(DOCUMENT)
      const spy = spyOn(doc.body, 'requestFullscreen')
      service.goFullscreen()

      expect(spy).toHaveBeenCalled()
    })

    it('canGoFullscreen$ should return true when fullscreen is supported and not in fullscreen ', done => {
      service.canGoFullscreen().pipe(take(1)).subscribe(val => {
        expect(val).toEqual(true)
        done()
      })
    })

    it('should continue returning after initial', done => {
      service.fullscreen$.pipe(skip(1)).subscribe(c => {
        expect(c).toEqual(false)
        done()
      })
      const doc = TestBed.get(DOCUMENT)
      const requestFullscreen = new Event('requestFullscreen')
      const fullscreenchange = new Event('fullscreenchange')
      doc.dispatchEvent(requestFullscreen)
      doc.dispatchEvent(fullscreenchange)
    })

    it('', () => {
      spyOnProperty(window.navigator, 'userAgent').and.returnValue('iPhone')
      setService()
      expect(service.isIphone()).toEqual(true)
    })

    it('should reference passthrough elm if required', () => {
      const elm = document.createElement('div')
      expect(service.extractVideoForIphoneIfRequired(elm)).toEqual(elm)
    })
    it('should reference nested video elements if required', () => {
      const elm = document.createElement('div')
      const elm2 = document.createElement('video')
      elm.append(elm2)
      spyOnProperty(window.navigator, 'userAgent').and.returnValue('iPhone')
      setService()
      expect(service.extractVideoForIphoneIfRequired(elm)).toEqual(elm2)
    })
    it('should reference passthrough elm if required', () => {
      const elm = document.createElement('div')
      spyOnProperty(window.navigator, 'userAgent').and.returnValue('iPhone')
      setService()
      expect(service.extractVideoForIphoneIfRequired(elm)).toEqual(elm)
    })
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
      service.canGoFullscreen().subscribe(val => {
        expect(val).toEqual(false)
      })
    }))

    it('should return false from fullscreenIsSupported', async(() => {
      service.fullscreenIsSupported().subscribe(res => expect(res).toEqual(false))
    }))

    it('should return false from fullscreen', async(() => {
      service.fullscreen$.subscribe(res => expect(res).toEqual(false))
    }))

    it('isIphone should return false', () => {
      expect(service.isIphone()).toEqual(false)
    })
  })
})
