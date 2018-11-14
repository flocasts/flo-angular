import { Component, NgModule, Input, SimpleChange } from '@angular/core'
import { TestBed, async } from '@angular/core/testing'
import { MseDirective, emitAndUnsubscribe } from './mse.directive'
import { By } from '@angular/platform-browser'
import { Subject, ObjectUnsubscribedError } from 'rxjs'
import { take } from 'rxjs/operators'
import {
  SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION, SUPPORTS_MSE_TARGET_NATIVELY,
  MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK, MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
  MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK, IMseInitFunc
} from './mse.tokens'
import { MseModule } from './mse.module'

const TEST_SRC = 'http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8'

export function testMseIsSupportedFactory() {
  return false
}

export function testMseSupportedNativelyFunction() {
  return () => false
}

export function testMseClientInitFunction() {
  const lambda: IMseInitFunc<any, any> = initEvent => {
    initEvent.messageSource.next()
  }
  return lambda
}

export function testMseClientSrcChangeFunction() {
  const lambda: any = srcChangeEvent => { }
  return lambda
}

export function testMseClientDestroyFunction() {
  const lambda: any = destroyEvent => { }
  return lambda
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
      useFactory: testMseSupportedNativelyFunction
    },
    {
      provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
      useFactory: testMseIsSupportedFactory
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_INIT_TASK,
      useFactory: testMseClientInitFunction
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_SRC_CHANGE_TASK,
      useFactory: testMseClientSrcChangeFunction
    },
    {
      provide: MEDIA_SOURCE_EXTENSION_LIBRARY_DESTROY_TASK,
      useFactory: testMseClientDestroyFunction
    }
  ]
})
export class HlsTestingModule { }

const createSut = () => {
  const hoist = TestBed.createComponent(HlsTestComponent)
  hoist.autoDetectChanges()
  const directive = hoist.debugElement.query(By.directive(MseDirective))
  return {
    hoist,
    directive,
    instance: directive.injector.get(MseDirective)
  }
}

const setTestBed = (supportsMle: boolean) => (native: boolean) => {
  TestBed.configureTestingModule({
    imports: [HlsTestingModule],
    providers: [
      {
        provide: SUPPORTS_TARGET_VIA_MEDIA_SOURCE_EXTENSION,
        useValue: supportsMle
      },
      {
        provide: SUPPORTS_MSE_TARGET_NATIVELY,
        useValue: () => native
      }
    ]
  })
}

const shouldUnsubscribeFromInternalNgOnDestroy = async(() => {
  const wrapper = createSut()
  const internalNgOnDestroy$ = (wrapper.instance as any)._ngOnDestroy$ as Subject<undefined>

  internalNgOnDestroy$.pipe(take(1)).subscribe(response => {
    expect(response).toBeUndefined()
  })

  wrapper.hoist.destroy()

  expect(() => internalNgOnDestroy$.next()).toThrow(new ObjectUnsubscribedError())
})

const shouldUnsubscribeFromInternalNgAfterViewInit = async(() => {
  const wrapper = createSut()
  const internalNgAfterViewInit$ = (wrapper.instance as any)._ngAfterViewInit$ as Subject<undefined>

  expect(() => {
    internalNgAfterViewInit$.pipe(take(1)).subscribe()
  }).toThrow(new ObjectUnsubscribedError())

  wrapper.hoist.destroy()
})

const shouldCompileTestComponent = done => {
  expect(createSut().hoist).toBeDefined()
  done()
}

const shouldCompilerDirective = done => {
  expect(createSut().directive).toBeDefined()
  done()
}

const skipSrcChangeWhenValueIs = (sc: SimpleChange) => {
  const wrapper = createSut()
  const spy = spyOn((wrapper.instance as any)._srcChanges$, 'next')
  wrapper.instance.ngOnChanges({
    floHls: sc
  })
  expect(spy).not.toHaveBeenCalled()
}

describe(`${MseDirective.name} when client supports Media Source Extensions`, () => {
  beforeEach(() => setTestBed(true)(false))
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
    const wrapper = createSut()
    const spy = spyOn(wrapper.instance as any, '_mseSourceChangeTask')
    wrapper.instance.ngOnChanges({
      src: new SimpleChange(TEST_SRC, 'http://www.test.com', false)
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
    skipSrcChangeWhenValueIs(new SimpleChange(TEST_SRC, TEST_SRC, false))
  })

  it('should skip src change when value is undefined', () => {
    skipSrcChangeWhenValueIs(new SimpleChange(undefined, undefined, false))
  })

  it('should unsubscribe from internal ngOnDestroy$ subject after single event emission', shouldUnsubscribeFromInternalNgOnDestroy)
  it('should unsubscribe from internal ngAfterViewInit$ subject after single event emission', shouldUnsubscribeFromInternalNgAfterViewInit)
})

describe(`${MseDirective.name} when supports mse client natively`, () => {
  beforeEach(() => setTestBed(false)(true))
  afterEach(() => TestBed.resetTestingModule())

  it('should compile the test component', shouldCompileTestComponent)
  it('should compile the directive under test', shouldCompilerDirective)
  it('should unsubscribe from internal ngOnDestroy$ subject after single event emission', shouldUnsubscribeFromInternalNgOnDestroy)
  it('should unsubscribe from internal ngAfterViewInit$ subject after single event emission', shouldUnsubscribeFromInternalNgAfterViewInit)
})
