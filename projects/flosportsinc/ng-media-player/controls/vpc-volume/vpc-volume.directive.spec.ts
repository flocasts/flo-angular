import { FloMediaPlayerControlVolumeDirective } from './vpc-volume.directive'
import { FloMediaPlayerControlsVolumeModule } from './vpc-volume.module'
import { Component, NgModule, Type } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

// tslint:disable: readonly-keyword
// tslint:disable: no-object-mutation

@Component({
  selector: 'flo-test-component-a1',
  template: `<video #videoRef></video>
    <input type="range" [floVpc]="videoRef" [floVpcMeta]="meta" floVpcVolume>
  `
})
export class FloTestA1Component {
  meta: { test: 123 }
}

@NgModule({
  declarations: [FloTestA1Component],
  imports: [CommonModule, FloMediaPlayerControlsVolumeModule]
})
export class TestModule { }

const createsut = (type: Type<any>) => {
  const fixture = TestBed.createComponent(type)
  fixture.detectChanges()
  const mediaDebug = fixture.debugElement.query(By.css('video'))
  const mediaElement = mediaDebug.nativeElement as HTMLMediaElement
  const inputElement = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement
  return {
    fixture,
    mediaDebug,
    mediaElement,
    inputElement
  }
}

describe(FloMediaPlayerControlVolumeDirective.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents()
  })

  afterEach(() => {
    TestBed.resetTestingModule()
  })

  it('should compile', () => {
    expect(createsut(FloTestA1Component)).toBeTruthy()
  })

  it('should sync to video element when not muted ', () => {
    const sut = createsut(FloTestA1Component)

    sut.mediaElement.muted = false
    sut.mediaElement.volume = 0.3

    sut.mediaElement.dispatchEvent(new Event('volumechange'))

    sut.fixture.detectChanges()

    expect(sut.inputElement.value).toEqual('0.3')
  })

  it('should set value to "0" when video element becomes muted ', () => {
    const sut = createsut(FloTestA1Component)

    sut.mediaElement.muted = true
    sut.mediaElement.volume = 0.3

    sut.mediaElement.dispatchEvent(new Event('volumechange'))

    sut.fixture.detectChanges()

    expect(sut.inputElement.value).toEqual('0')
  })


  it('should sync video volume on input "change" event when video not muted', () => {
    const sut = createsut(FloTestA1Component)

    sut.inputElement.value = '0.6'
    sut.inputElement.dispatchEvent(new Event('change'))

    sut.fixture.detectChanges()

    expect(sut.mediaElement.volume).toEqual(0.6)
  })

  it('when video muted, should unmute video volume and set to 0 on input "change" event', () => {
    const sut = createsut(FloTestA1Component)

    sut.mediaElement.muted = true
    sut.inputElement.value = '0.6'
    sut.inputElement.dispatchEvent(new Event('change'))

    sut.fixture.detectChanges()

    expect(sut.mediaElement.volume).toEqual(0)
    expect(sut.mediaElement.muted).toEqual(false)
  })

  it('should set video volume on input "input" event when video not muted', () => {
    const sut = createsut(FloTestA1Component)

    sut.inputElement.value = '0.6'
    sut.inputElement.dispatchEvent(new Event('input'))

    sut.fixture.detectChanges()

    expect(sut.mediaElement.volume).toEqual(0.6)
  })

  it('when video muted, should unmute video volume and set to 0 on input "input" event', () => {
    const sut = createsut(FloTestA1Component)

    sut.mediaElement.muted = true
    sut.inputElement.value = '0.6'
    sut.inputElement.dispatchEvent(new Event('input'))

    sut.fixture.detectChanges()

    expect(sut.mediaElement.volume).toEqual(0)
    expect(sut.mediaElement.muted).toEqual(false)
  })
})
