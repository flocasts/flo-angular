import { Component, NgModule } from '@angular/core'
import { FloFullscreenToggleModule } from './ng-fullscreen.toggle.module'
import { FloClickToEnterFullscreenDirective, FloClickToExitFullscreenDirective } from './ng-fullscreen.toggle.directive'
import { TestBed, async } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { FloFullscreenService } from '../common/ng-fullscreen.service'
import { DOCUMENT } from '@angular/common'

@Component({
  selector: 'flo-test-component',
  template: `<div id="container" #ref>
    <button [floClickToEnterFullscreen]="ref">ENTER</button>
    <button floClickToExitFullscreen>EXIT</button>
  </div>`
})
export class FloTestComponent { }

@Component({
  selector: 'flo-test-component-empty',
  template: `<div id="container">
    <button floClickToEnterFullscreen>ENTER</button>
    <button floClickToExitFullscreen>EXIT</button>
  </div>`
})
export class FloTestEmptyComponent { }

@NgModule({
  declarations: [FloTestComponent, FloTestEmptyComponent],
  imports: [FloFullscreenToggleModule],
  exports: [FloFullscreenToggleModule],
})
export class FloFullscreenTestModule { }

describe(FloFullscreenToggleModule.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule]
    })
  })

  afterEach(() => TestBed.resetTestingModule())

  describe(FloClickToExitFullscreenDirective.name, () => {
    it('should click to fullscreen', async(() => {
      const sut = TestBed.createComponent(FloTestComponent).debugElement.query(By.directive(FloClickToExitFullscreenDirective))

      const spy = spyOn(document, 'exitFullscreen')

      sut.nativeElement.click()

      expect(spy).toHaveBeenCalled()
    }))
  })

  describe(FloClickToEnterFullscreenDirective.name, () => {
    it('should enter to fullscreen', () => {
      const comp = TestBed.createComponent(FloTestComponent)
      const service = TestBed.get(FloFullscreenService) as FloFullscreenService
      const sut = comp.debugElement.query(By.directive(FloClickToEnterFullscreenDirective)).nativeElement as HTMLButtonElement
      const container = comp.debugElement.query(By.css('#container')).nativeElement as HTMLDivElement
      const spy = spyOn(service, 'goFullscreen').and.callThrough()
      comp.detectChanges()

      sut.click()

      expect(spy).toHaveBeenCalledWith(container)
    })

    it('should enter to fullscreen', () => {
      const comp = TestBed.createComponent(FloTestEmptyComponent)
      const service = TestBed.get(FloFullscreenService) as FloFullscreenService
      const sut = comp.debugElement.query(By.directive(FloClickToEnterFullscreenDirective)).nativeElement as HTMLButtonElement
      const spy = spyOn(service, 'goFullscreen').and.callThrough()
      comp.detectChanges()

      sut.click()

      expect(spy).toHaveBeenCalledWith(TestBed.get(DOCUMENT).body)
    })
  })
})

