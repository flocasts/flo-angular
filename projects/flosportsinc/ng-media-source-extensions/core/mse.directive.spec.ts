import { Component, NgModule, Input, SimpleChange } from '@angular/core'
import { TestBed, async } from '@angular/core/testing'
import { MseDirective, emitAndUnsubscribe } from './mse.directive'
import { By } from '@angular/platform-browser'
import { Subject, ObjectUnsubscribedError } from 'rxjs'
import { take } from 'rxjs/operators'
import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, SUPPORTS_MSE_TARGET_NATIVELY,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK, MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK, IMseInitFunc, IVideoElementSupportsTargetMseCheckContext,
  IVideoElementSupportsTargetMseCheck, IMseInit, IMseSrcChange, IMseSrcChangeFunc, IMseDestroy, IMseDestroyFunc,
  IMsePatternCheck, IMsePatternCheckFunc, MEDIA_SOURCE_EXTENSION_PATTERN_MATCH
} from './mse.tokens'
import { MseModule } from './mse.module'
import { HlsModule } from '../hls/hls.module'
import { DashModule } from '../dash/dash.module'
import * as Hls from 'hls.js'

export const TEST_SOURCES = {
  HLS: {
    TINY: '/base/test/hls/stream_110k_48k_416x234.m3u8',
    SMALL: '/base/test/hls/stream_200k_48k_416x234.m3u8',
  },
  DASH: {
    PARKOR: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd'
  },
  MP4: {
    BUNNY: '/base/test/mp4/bunny.mp4'
  }
}

const PRIMARY_SRC = TEST_SOURCES.HLS.TINY

export interface HlsMessage {
  readonly key: keyof typeof Hls.Events
  readonly message: any
}

@Component({
  selector: 'flo-test-component',
  template: '<video controls floMse [src]="src"></video>'
})
export class HlsTestComponent {
  // tslint:disable-next-line:readonly-keyword
  @Input() public src?: string = PRIMARY_SRC
}

@NgModule({
  imports: [MseModule, HlsModule, DashModule],
  declarations: [HlsTestComponent],
  exports: [HlsTestComponent]
})
export class MseTestingModule { }

export const createMseSut = () => {
  const hoist = TestBed.createComponent(HlsTestComponent)
  // hoist.autoDetectChanges()
  const directive = hoist.debugElement.query(By.directive(MseDirective))
  return {
    hoist,
    directive,
    instance: directive.injector.get(MseDirective)
  }
}

export const setMseTestBed = (supportsMle: boolean) => (native: boolean) => {
  TestBed.configureTestingModule({
    imports: [MseTestingModule],
    providers: [
      {
        provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
        useValue: supportsMle,
        multi: true
      },
      {
        provide: SUPPORTS_MSE_TARGET_NATIVELY,
        useValue: () => native,
        multi: true
      }
    ]
  })
}

const shouldUnsubscribeFromInternalNgOnDestroy = async(() => {
  const wrapper = createMseSut()
  const internalNgOnDestroy$ = (wrapper.instance as any)._ngOnDestroy$ as Subject<undefined>

  internalNgOnDestroy$.pipe(take(1)).subscribe(response => {
    expect(response).toBeUndefined()
  })

  wrapper.hoist.destroy()

  expect(() => internalNgOnDestroy$.next()).toThrow(new ObjectUnsubscribedError())
})

const shouldUnsubscribeFromInternalNgAfterViewInit = async(() => {
  const wrapper = createMseSut()
  wrapper.hoist.detectChanges()
  const internalNgAfterViewInit$ = (wrapper.instance as any)._ngAfterViewInit$ as Subject<undefined>

  expect(() => {
    internalNgAfterViewInit$.pipe(take(1)).subscribe()
  }).toThrow(new ObjectUnsubscribedError())

  wrapper.hoist.destroy()
})

const shouldCompileTestComponent = done => {
  expect(createMseSut().hoist).toBeDefined()
  done()
}

const shouldCompilerDirective = done => {
  expect(createMseSut().directive).toBeDefined()
  done()
}

const skipSrcChangeWhenValueIs = (sc: SimpleChange) => {
  const wrapper = createMseSut()
  const spy = spyOn((wrapper.instance as any)._srcChanges$, 'next')
  wrapper.instance.ngOnChanges({
    floHls: sc
  })
  expect(spy).not.toHaveBeenCalled()
}

describe('rewrite these... problems', () => {
  beforeEach(() => setMseTestBed(true)(false))
  afterEach(() => TestBed.resetTestingModule())

  it('should not continue emitAndUnsubscribe when already unsubscribed', () => {
    const testSub = new Subject<any>()
    testSub.unsubscribe()
    const spy1 = spyOn(testSub, 'next')
    const spy2 = spyOn(testSub, 'unsubscribe')
    emitAndUnsubscribe(testSub)
    expect(spy1).not.toHaveBeenCalled()
    expect(spy2).not.toHaveBeenCalled()
  })

  it('should trigger source change task when MSE client is the same type', () => {
    const sut = createMseSut()
    sut.hoist.detectChanges()
    sut.instance.srcChange.subscribe(srcChange => {
      srcChange.current.tap({
        none: () => expect(true).toEqual(false),
        some: src => expect(src).toEqual(TEST_SOURCES.HLS.SMALL)
      })
      srcChange.previous.tap({
        none: () => expect(true).toEqual(false),
        some: src => expect(src).toEqual(TEST_SOURCES.HLS.TINY)
      })
    });
    // tslint:disable-next-line:no-object-mutation
    (sut.hoist.componentInstance.src as any) = TEST_SOURCES.HLS.SMALL
    sut.hoist.detectChanges()
  })

  it('should trigger source change task when MSE client is the diff type', () => {
    const wrapper = createMseSut()
    wrapper.hoist.detectChanges()
    const task = (wrapper.instance as any)._mseInitTask[2]
    const spy = spyOn(task, 'func').and.callThrough();
    // tslint:disable-next-line:no-object-mutation
    (wrapper.hoist.componentInstance.src as any) = TEST_SOURCES.DASH.PARKOR
    wrapper.hoist.detectChanges()
    expect(spy).toHaveBeenCalled()
  })

  it('should trigger destroy function for DI configurations', () => {
    const sut = createMseSut()
    sut.hoist.detectChanges()
    const task = (sut.instance as any)._mseDestroyTask[1]
    const spy = spyOn(task, 'func').and.callThrough()
    sut.hoist.destroy()
    expect(spy).toHaveBeenCalled()
  })

  it('should set src', () => {
    const wrapper = createMseSut()
    const instance = wrapper.instance as any
    const task = (wrapper.instance as any)
    const spy = spyOn(task, '_setSrc').and.callThrough()
    const spy2 = spyOn(instance, '_executeInit').and.callThrough();
    (wrapper.hoist.componentInstance.src as any) = 'noinit1.file'
    wrapper.hoist.detectChanges();
    (wrapper.hoist.componentInstance.src as any) = 'noinit2.file'
    wrapper.hoist.detectChanges()
    // expect(spy).toHaveBeenCalled()
    // expect(spy2).toHaveBeenCalled()
  })

  // it('should take path when no init task provided', () => {
  //   const sut = createMseSut()
  //   sut.hoist.detectChanges()
  //   const instance = sut.instance as any
  //   const spy2 = spyOn(instance, '_executeInit');
  //   (sut.hoist.componentInstance.src as any) = 'noinit1.file';
  //   // sut.hoist.detectChanges();
  //   (sut.hoist.componentInstance.src as any) = 'noinit2.file'
  //   // sut.hoist.detectChanges()
  //   expect(spy2).toHaveBeenCalled()
  // })

  it('should not push src change when same src value during ngOnChanges', () => {
    const sut = createMseSut()
    sut.hoist.detectChanges()
    const internalSrcChangeRef = (sut.instance as any)._srcChanges$
    const spy = spyOn(internalSrcChangeRef, 'next')
    sut.instance.ngOnChanges({ src: new SimpleChange(PRIMARY_SRC, PRIMARY_SRC, false) })
    expect(spy).not.toHaveBeenCalled()
  })

  it('not call isMediaSource supported when other checks do not exist', () => {
    const sut = createMseSut()
    const task = (sut.instance as any)._isMediaSourceSupported[0]
    const spy = spyOn(task, 'func');
    (sut.hoist.componentInstance.src as any) = TEST_SOURCES.HLS.SMALL
    sut.hoist.detectChanges();
    (sut.hoist.componentInstance.src as any) = TEST_SOURCES.HLS.SMALL
    sut.hoist.detectChanges()
    // expect(spy).not.toHaveBeenCalled()
  })

  it('not', () => {
    TestBed.resetTestingModule()
    setMseTestBed(false)(false)
    const sut = createMseSut();
    // tslint:disable-next-line:no-object-mutation
    (sut.hoist.componentInstance.src as any) = TEST_SOURCES.DASH.PARKOR
    sut.hoist.detectChanges()
  })
})

describe(`${MseDirective.name} when client supports Media Source Extensions`, () => {
  beforeEach(() => setMseTestBed(true)(false))
  afterEach(() => TestBed.resetTestingModule())

  it('should compile the test component', shouldCompileTestComponent)
  it('should compile the directive under test', shouldCompilerDirective)

  it('should skip src change when value is same', () => {
    skipSrcChangeWhenValueIs(new SimpleChange(PRIMARY_SRC, PRIMARY_SRC, false))
  })

  it('should skip src change when value is undefined', () => {
    skipSrcChangeWhenValueIs(new SimpleChange(undefined, undefined, false))
  })

  it('should unsubscribe from internal ngOnDestroy$ subject after single event emission', shouldUnsubscribeFromInternalNgOnDestroy)
  it('should unsubscribe from internal ngAfterViewInit$ subject after single event emission', shouldUnsubscribeFromInternalNgAfterViewInit)
})

describe(`${MseDirective.name} when supports mse client natively`, () => {
  beforeEach(() => setMseTestBed(false)(true))
  afterEach(() => TestBed.resetTestingModule())

  it('should compile the test component', shouldCompileTestComponent)
  it('should compile the directive under test', shouldCompilerDirective)
  it('should unsubscribe from internal ngOnDestroy$ subject after single event emission', shouldUnsubscribeFromInternalNgOnDestroy)
  it('should unsubscribe from internal ngAfterViewInit$ subject after single event emission', shouldUnsubscribeFromInternalNgAfterViewInit)
})

