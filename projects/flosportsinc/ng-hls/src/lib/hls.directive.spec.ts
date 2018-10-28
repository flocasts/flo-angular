import { Component, NgModule, Input, SimpleChange } from '@angular/core'
import { TestBed, async } from '@angular/core/testing'
import { HlsDirective, emitAndUnsubscribe } from './hls.directive'
import { By } from '@angular/platform-browser'
import { Subject, ObjectUnsubscribedError } from 'rxjs'
import { take } from 'rxjs/operators'
import { SUPPORTS_HLS_VIA_MEDIA_SOURCE_EXTENSION, SUPPORTS_HLS_NATIVELY } from './hls.tokens'
import { HlsJsModule } from './hlsjs.module'

const TEST_SRC = 'http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8'

@Component({
  selector: 'flo-test-component',
  template: '<video [floHls]="src"></video>'
})
export class HlsTestComponent {
  // tslint:disable-next-line:readonly-keyword
  @Input() public src?: string = TEST_SRC
}

@NgModule({
  imports: [HlsJsModule],
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
        useValue: false
      },
      {
        provide: SUPPORTS_HLS_NATIVELY,
        useValue: () => true
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
        useValue: true
      },
      {
        provide: SUPPORTS_HLS_NATIVELY,
        useValue: () => false
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

  it('should not continue emitAndUnsubscribe when already unsubscribed', done => {
    const testSub = new Subject<any>()
    testSub.unsubscribe()
    const spy1 = spyOn(testSub, 'next')
    const spy2 = spyOn(testSub, 'unsubscribe')
    emitAndUnsubscribe(testSub)
    expect(spy1).not.toHaveBeenCalled()
    expect(spy2).not.toHaveBeenCalled()
    done()
  })

  it('should trigger MSE source change', done => {
    const wrapper = createSut()
    const spy = spyOn(wrapper.instance as any, '_mseSourceChangeTask')
    wrapper.instance.ngOnChanges({
      floHls: new SimpleChange(TEST_SRC, 'http://www.test.com', false)
    })
    expect(spy).toHaveBeenCalled()
    done()
  })

  it('should trigger destory function for DI configurations', done => {
    const wrapper = createSut()
    const spy = spyOn(wrapper.instance as any, '_mseDestroyTask')
    wrapper.hoist.destroy()
    expect(spy).toHaveBeenCalled()
    done()
  })

  it('should skip src change when value is same', () => {
    const wrapper = createSut()
    const spy = spyOn((wrapper.instance as any)._hlsSrcChanges$, 'next')
    wrapper.instance.ngOnChanges({
      floHls: new SimpleChange(TEST_SRC, TEST_SRC, false)
    })
    expect(spy).not.toHaveBeenCalled()
  })

  it('should skip src change when value is undefined', () => {
    const wrapper = createSut()
    const spy = spyOn((wrapper.instance as any)._hlsSrcChanges$, 'next')
    wrapper.instance.ngOnChanges({
      floHls: new SimpleChange(undefined, undefined, false)
    })
    expect(spy).not.toHaveBeenCalled()
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

    expect(() => {
      internalNgAfterViewInit$.pipe(take(1)).subscribe()
    }).toThrow(new ObjectUnsubscribedError())

    wrapper.hoist.destroy()
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

    expect(() => {
      internalNgAfterViewInit$.pipe(take(1)).subscribe()
    }).toThrow(new ObjectUnsubscribedError())

    wrapper.hoist.destroy()
  }))
})
