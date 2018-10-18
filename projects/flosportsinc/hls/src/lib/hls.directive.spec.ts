import { Component, NgModule } from '@angular/core'
import { TestBed, async } from '@angular/core/testing'
import { HlsDirective } from './hls.directive'
import { HlsModule } from './hls.module'
import { By } from '@angular/platform-browser'
import { Subject, ObjectUnsubscribedError } from 'rxjs'
import { take } from 'rxjs/operators'
import { SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION, SUPPORTS_HLS_NATIVELY } from './hls.tokens'

@Component({
  selector: 'flo-test-component',
  template: '<video floHls="http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8"></video>'
})
export class HlsTestComponent { }

@NgModule({
  imports: [HlsModule],
  declarations: [HlsTestComponent],
  exports: [HlsTestComponent]
})
export class HlsTestingModule { }

const createSut = () => {
  const hoist = TestBed.createComponent(HlsTestComponent)
  hoist.autoDetectChanges()
  const directive = hoist.debugElement.query(By.directive(HlsDirective))
  return {
    hoist,
    directive,
    instance: directive.injector.get(HlsDirective)
  }
}

const setTestBedToNativeModule = () => {
  TestBed.configureTestingModule({
    imports: [HlsTestingModule],
    providers: [
      {
        provide: SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION,
        useValue: true
      },
      {
        provide: SUPPORTS_HLS_NATIVELY,
        useValue: () => false
      }
    ]
  })
}

const setTestBedToMediaSourceModule = () => {
  TestBed.configureTestingModule({
    imports: [HlsTestingModule],
    providers: [
      {
        provide: SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION,
        useValue: false
      },
      {
        provide: SUPPORTS_HLS_NATIVELY,
        useValue: () => true
      }
    ]
  })
}

describe(`${HlsDirective.name} when client supports Media Source Extensions`, () => {
  beforeEach(() => setTestBedToMediaSourceModule())
  afterEach(() => TestBed.resetTestingModule())

  it('should compile the test component', done => {
    expect(createSut().hoist).toBeDefined()
    done()
  })

  it('should compile the directive under test', done => {
    expect(createSut().directive).toBeDefined()
    done()
  })

  it('should unsubscribe from internal ngOnDestroy$ subject after single event emission', async(() => {
    const wrapper = createSut()
    const internalNgOnDestroy$ = (wrapper.instance as any)._ngOnDestroy$ as Subject<undefined>

    internalNgOnDestroy$.pipe(take(1)).subscribe(response => {
      expect(response).toBeUndefined()
    })

    wrapper.hoist.destroy()

    expect(() => internalNgOnDestroy$.next()).toThrow(new ObjectUnsubscribedError())
  }))

  it('should unsubscribe from internal ngAfterViewInit$ subject after single event emission', async(() => {
    const wrapper = createSut()
    const internalNgAfterViewInit$ = (wrapper.instance as any)._ngAfterViewInit$ as Subject<undefined>

    expect(() => internalNgAfterViewInit$.pipe(take(1)).subscribe()).toThrow(new ObjectUnsubscribedError())
  }))
})

describe(`${HlsDirective.name} when client supports HLS natively`, () => {
  beforeEach(() => setTestBedToNativeModule())
  afterEach(() => TestBed.resetTestingModule())

  it('should compile the test component', done => {
    expect(createSut().hoist).toBeDefined()
    done()
  })

  it('should compile the directive under test', done => {
    expect(createSut().directive).toBeDefined()
    done()
  })

  it('should unsubscribe from internal ngOnDestroy$ subject after single event emission', async(() => {
    const wrapper = createSut()
    const internalNgOnDestroy$ = (wrapper.instance as any)._ngOnDestroy$ as Subject<undefined>

    internalNgOnDestroy$.pipe(take(1)).subscribe(response => {
      expect(response).toBeUndefined()
    })

    wrapper.hoist.destroy()

    expect(() => internalNgOnDestroy$.next()).toThrow(new ObjectUnsubscribedError())
  }))

  it('should unsubscribe from internal ngAfterViewInit$ subject after single event emission', async(() => {
    const wrapper = createSut()
    const internalNgAfterViewInit$ = (wrapper.instance as any)._ngAfterViewInit$ as Subject<undefined>

    expect(() => internalNgAfterViewInit$.pipe(take(1)).subscribe()).toThrow(new ObjectUnsubscribedError())
  }))
})
