import {FloLazyLoadDirective} from './defer-load.directive'
import {Component, Input} from '@angular/core'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {By} from '@angular/platform-browser'

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  template: '<div [eagerLoad]="eager" (floLazyLoad)="show = true"><p *ngIf="show">success</p></div>'
})
class LazyBoiComponent {
  @Input() public eager = false
  public show = false
}

describe(FloLazyLoadDirective.name, () => {
  let fixture: ComponentFixture<LazyBoiComponent>
  let component: LazyBoiComponent

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FloLazyLoadDirective, LazyBoiComponent ]
    })

    fixture = TestBed.createComponent(LazyBoiComponent)
    component = fixture.componentInstance
  })

  it('compiles', () => {
    expect(fixture.nativeElement).toBeDefined()
  })

  it('can load eagerly', () => {
    component.eager = true
    fixture.detectChanges()

    const paragraph: HTMLParagraphElement = fixture.debugElement.query(By.css('p')).nativeElement

    expect(paragraph).toBeDefined()
    expect(paragraph.innerHTML).toBe('success')
  })
})
