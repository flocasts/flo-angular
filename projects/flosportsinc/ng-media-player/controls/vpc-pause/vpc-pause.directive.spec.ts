import { Component, NgModule, Type } from '@angular/core'
import { FloMediaPlayerControlsPauseModule } from './vpc-pause.module'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'
import { FloMediaPlayerPauseControlDirective } from './vpc-pause.directive'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Component({
  selector: 'flo-test-component',
  template: `<video #videoRef></video><button [floMpc]="videoRef" [floMpcMeta]="meta" floMpcPause>PLAY</button>`
})
export class FloTestComponent {
  meta: { test: 123 }
}

@Component({
  selector: 'flo-test-component-a1',
  template: `<video #videoRef></video><button floMpc floMpcPause>PLAY</button>`
})
export class FloTestA1Component { }

@Component({
  selector: 'flo-test-component-a2',
  template: `<video #videoRef></video><button [floMpc]="videoRef" [floMpcPause]="false">PLAY</button>`
})
export class FloTestA2Component { }

@NgModule({
  declarations: [FloTestComponent, FloTestA1Component, FloTestA2Component],
  imports: [CommonModule, FloMediaPlayerControlsPauseModule]
})
export class TestModule { }

const createsut = (type: Type<any>) => {
  const fixture = TestBed.createComponent(type)
  fixture.detectChanges()
  const videoElement = fixture.debugElement.query(By.css('video')).nativeElement as HTMLVideoElement
  const btnElement = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement
  return {
    fixture,
    videoElement,
    btnElement
  }
}

describe(FloMediaPlayerPauseControlDirective.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents()
  })

  afterEach(() => {
    TestBed.resetTestingModule()
  })

  it('should play video when clicked', () => {
    const sut = createsut(FloTestComponent)
    const spy = spyOn(sut.videoElement, 'pause').and.callThrough()
    sut.btnElement.click()
    expect(spy).toHaveBeenCalled()
  })

  it('should do nothing when clicked without a media element reference', () => {
    const sut = createsut(FloTestA1Component)
    const spy = spyOn(sut.videoElement, 'pause').and.callThrough()
    sut.btnElement.click()
    expect(spy).not.toHaveBeenCalled()
  })

  it('should do nothing when clicked and input set to false', () => {
    const sut = createsut(FloTestA2Component)
    const spy = spyOn(sut.videoElement, 'pause').and.callThrough()
    sut.btnElement.click()
    expect(spy).not.toHaveBeenCalled()
  })
})
