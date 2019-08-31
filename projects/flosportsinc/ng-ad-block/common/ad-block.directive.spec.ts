import { Component, NgModule } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { of } from 'rxjs'
import { FloAdBlockModule } from './ad-block.module'
import { FloIfAdBlockedDirective } from './ad-block.directive'
import { AD_BLOCK_LOADER } from './ad-block.tokens'
import { AdBlockService } from './ad-block.service'

@Component({
  selector: 'flo-test-component',
  template: `
  <div id="floIfAdBlocked" *floIfAdBlocked>floIfAdBlocked</div>
  <div id="floIfNotAdBlocked" *floIfNotAdBlocked>floIfNotAdBlocked</div>
`})
export class FloTestComponent { }

export const trueLoader = () => of(true)
export const falseLoader = () => of(false)

@NgModule({
  declarations: [FloTestComponent],
  imports: [FloAdBlockModule],
  exports: [FloAdBlockModule, FloTestComponent],
  providers: [
    AdBlockService,
    { provide: AD_BLOCK_LOADER, useFactory: falseLoader }
  ]
})
export class FloFullscreenTestModule { }

const createSut = () => {
  const sut = TestBed.createComponent(FloTestComponent)
  sut.detectChanges()
  return sut
}

describe(FloIfAdBlockedDirective.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule]
    }).compileComponents()
  })

  it('should compile', () => {
    expect(createSut()).toBeTruthy()
  })

  it('should show floIfAdBlocked element', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloFullscreenTestModule],
      providers: [
        { provide: AD_BLOCK_LOADER, useFactory:  trueLoader }
      ]
    })
    const sut = createSut()
    const element1 = sut.debugElement.query(By.css('#floIfAdBlocked'))
    const element2 = sut.debugElement.query(By.css('#floIfNotAdBlocked'))
    sut.detectChanges()
    expect(element1.nativeElement.innerText).toEqual('floIfAdBlocked')
    expect(element2).toBeNull()
  })

  it('should show floIfNotAdBlocked element', () => {
    const sut = createSut()
    const element1 = sut.debugElement.query(By.css('#floIfAdBlocked'))
    const element2 = sut.debugElement.query(By.css('#floIfNotAdBlocked'))
    sut.detectChanges()
    expect(element1).toBeNull()
    expect(element2.nativeElement.innerText).toEqual('floIfNotAdBlocked')
  })
})
