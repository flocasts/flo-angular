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
import * as Hls from 'hls.js'

const TEST_SRC = 'http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8'
const exectionKey = 'HLS'

export interface HlsMessage {
  readonly key: keyof typeof Hls.Events
  readonly message: any
}

export function defaultIsSupportedFactory() {
  const func = () => Hls.isSupported()
  return {
    exectionKey,
    func
  }
}

export function defaultHlsSupportedNativelyFunction(): IVideoElementSupportsTargetMseCheckContext {
  const func: IVideoElementSupportsTargetMseCheck = ve =>
    typeof ve.canPlayType === 'function' && ve.canPlayType('application/vnd.apple.mpegurl') &&
      !defaultIsSupportedFactory().func() ? true : false
  return {
    exectionKey,
    func
  }
}

export function defaultMseClientInitFunction(): IMseInit<Hls, HlsMessage> {
  const func: IMseInitFunc<Hls, HlsMessage> = initEvent => {
    const client = new Hls()
    client.loadSource(initEvent.src)
    client.attachMedia(initEvent.videoElement)
    Object.keys(Hls.Events).forEach(key => {
      client.on(Hls.Events[key], (eventKey: any, b) => initEvent.messageSource.next({ key: eventKey, message: b }))
    })
    return client
  }
  return {
    exectionKey,
    func
  }
}

export function tester2MseClientInitFunction(): IMseInit<Hls, HlsMessage> {
  const func: IMseInitFunc<Hls, HlsMessage> = initEvent => {
    const client = new Hls()
    client.loadSource(initEvent.src)
    client.attachMedia(initEvent.videoElement)
    Object.keys(Hls.Events).forEach(key => {
      client.on(Hls.Events[key], (eventKey: any, b) => initEvent.messageSource.next({ key: eventKey, message: b }))
    })
    return client
  }
  return {
    exectionKey: 'tester2',
    func
  }
}

export function tester3MseClientInitFunction(): IMseInit<Hls, HlsMessage> {
  const func: IMseInitFunc<Hls, HlsMessage> = initEvent => {
    const client = new Hls()
    client.loadSource(initEvent.src)
    client.attachMedia(initEvent.videoElement)
    Object.keys(Hls.Events).forEach(key => {
      client.on(Hls.Events[key], (eventKey: any, b) => initEvent.messageSource.next({ key: eventKey, message: b }))
    })
    return client
  }
  return {
    exectionKey: 'tester3',
    func
  }
}

export function defaultMseClientSrcChangeFunction(): IMseSrcChange<Hls> {
  const func: IMseSrcChangeFunc<Hls> = srcChangeEvent => {
    srcChangeEvent.videoElement.pause()
    srcChangeEvent.clientRef.detachMedia()
    srcChangeEvent.clientRef.loadSource(srcChangeEvent.src)
    srcChangeEvent.clientRef.attachMedia(srcChangeEvent.videoElement)
  }
  return {
    exectionKey,
    func
  }
}

export function defaultMseClientDestroyFunction(): IMseDestroy<Hls> {
  const func: IMseDestroyFunc<Hls> = destroyEvent => {
    destroyEvent.clientRef.stopLoad()
    destroyEvent.clientRef.detachMedia()
    destroyEvent.clientRef.destroy()
  }
  return {
    exectionKey,
    func
  }
}

export function defaultHlsPatternCheck(): IMsePatternCheck {
  const func: IMsePatternCheckFunc = (videoSource: string) => videoSource.includes('.m3u8')
  return {
    exectionKey,
    func
  }
}

export function defaultTestPatternCheck1(): IMsePatternCheck {
  const func: IMsePatternCheckFunc = (videoSource: string) => videoSource.includes('.test1')
  return {
    exectionKey: 'tester1',
    func
  }
}

export function defaultTestPatternCheck2(): IMsePatternCheck {
  const func: IMsePatternCheckFunc = (videoSource: string) => videoSource.includes('.test2')
  return {
    exectionKey: 'tester2',
    func
  }
}

export function defaultTestPatternCheck3(): IMsePatternCheck {
  const func: IMsePatternCheckFunc = (videoSource: string) => videoSource.includes('.test3')
  return {
    exectionKey: 'tester3',
    func
  }
}

export function tester1IsSupportedFactory() {
  const func = () => Hls.isSupported()
  return {
    exectionKey: 'tester1',
    func
  }
}

export function tester2IsSupportedFactory() {
  const func = () => Hls.isSupported()
  return {
    exectionKey: 'tester2',
    func
  }
}

@Component({
  selector: 'flo-test-component',
  template: '<video floMse [src]="src"></video>'
})
export class HlsTestComponent {
  // tslint:disable-next-line:readonly-keyword
  @Input() public src?: string = TEST_SRC
}

@NgModule({
  imports: [MseModule],
  declarations: [HlsTestComponent],
  exports: [HlsTestComponent],
  providers: [
    {
      provide: SUPPORTS_MSE_TARGET_NATIVELY,
      useFactory: defaultHlsSupportedNativelyFunction,
      multi: true
    },
    {
      provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
      useFactory: defaultIsSupportedFactory,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
      useFactory: defaultMseClientInitFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
      useFactory: defaultMseClientSrcChangeFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
      useFactory: defaultMseClientDestroyFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
      useFactory: defaultHlsPatternCheck,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
      useFactory: defaultTestPatternCheck1,
      multi: true
    },
    {
      provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
      useFactory: tester1IsSupportedFactory,
      multi: true
    },
    {
      provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
      useFactory: tester2IsSupportedFactory,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
      useFactory: defaultTestPatternCheck2,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
      useFactory: tester2MseClientInitFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
      useFactory: tester3MseClientInitFunction,
      multi: true
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_PATTERN_MATCH,
      useFactory: defaultTestPatternCheck3,
      multi: true
    }
  ]
})
export class MseTestingModule { }

export const createMseSut = () => {
  const hoist = TestBed.createComponent(HlsTestComponent)
  hoist.autoDetectChanges()
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

describe(`${MseDirective.name} when client supports Media Source Extensions`, () => {
  beforeEach(() => setMseTestBed(true)(false))
  afterEach(() => TestBed.resetTestingModule())

  it('should compile the test component', shouldCompileTestComponent)
  it('should compile the directive under test', shouldCompilerDirective)

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
    const wrapper = createMseSut()
    const task = (wrapper.instance as any)._mseDestroyTask[1]
    const spy = spyOn(task, 'func')
    wrapper.instance.ngOnChanges({
      src: new SimpleChange(TEST_SRC, 'http://www.test.com', false)
    })
    expect(spy).toHaveBeenCalled()
    done()
  })

  it('should trigger destory function for DI configurations', done => {
    const wrapper = createMseSut()
    const task = (wrapper.instance as any)._mseDestroyTask[1]
    const spy = spyOn(task, 'func')
    wrapper.hoist.destroy()
    expect(spy).toHaveBeenCalled()
    done()
  })

  it('should trigger source change task when MSE client is the same type', done => {
    const wrapper = createMseSut()
    const task = (wrapper.instance as any)._mseSourceChangeTask[1]
    const spy = spyOn(task, 'func');
    // tslint:disable-next-line:no-object-mutation
    (wrapper.hoist.componentInstance.src as any) = 'http://video.m3u8'
    wrapper.hoist.detectChanges()
    expect(spy).toHaveBeenCalled()
    done()
  })

  it('should take path when no init task provided', done => {
    const wrapper = createMseSut()
    const task = (wrapper.instance as any)
    const spy = spyOn(task, '_setSrc');
    (wrapper.hoist.componentInstance.src as any) = 'http://vid2o.test1'
    wrapper.hoist.detectChanges();
    (wrapper.hoist.componentInstance.src as any) = 'http://vid3o.test1'
    wrapper.hoist.detectChanges()
    expect(spy).toHaveBeenCalled()
    done()
  })

  it('should take path when no init task provided', done => {
    const wrapper = createMseSut()
    const instance = wrapper.instance as any
    const spy2 = spyOn(instance, '_executeInit');
    (wrapper.hoist.componentInstance.src as any) = 'http://vid2o.test2'
    wrapper.hoist.detectChanges();
    (wrapper.hoist.componentInstance.src as any) = 'http://vid3o.test2'
    wrapper.hoist.detectChanges()
    expect(spy2).toHaveBeenCalled()
    done()
  })

  it('should not push src change when same src value during ngOnChanges', done => {
    const wrapper = createMseSut()
    const internalSrcChangeRef = (wrapper.instance as any)._srcChanges$
    const spy = spyOn(internalSrcChangeRef, 'next')
    wrapper.instance.ngOnChanges({ src: new SimpleChange(TEST_SRC, TEST_SRC, false) })
    expect(spy).not.toHaveBeenCalled()
    done()
  })

  it('not call isMediaSource supported when other checks do not exist', done => {
    const wrapper = createMseSut()
    const task = (wrapper.instance as any)._isMediaSourceSupported[3]
    const spy = spyOn(task, 'func');
    (wrapper.hoist.componentInstance.src as any) = 'http://vid2o.test3'
    wrapper.hoist.detectChanges();
    (wrapper.hoist.componentInstance.src as any) = 'http://vid3o.test3'
    wrapper.hoist.detectChanges()
    expect(spy).not.toHaveBeenCalled()
    done()
  })

  it('should skip src change when value is same', () => {
    skipSrcChangeWhenValueIs(new SimpleChange(TEST_SRC, TEST_SRC, false))
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

