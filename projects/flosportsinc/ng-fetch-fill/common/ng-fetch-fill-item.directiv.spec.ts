import { Component, NgModule, QueryList, ViewChildren } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FloFetchFillItemDirective } from './ng-fetch-fill-item.directive'
import { By } from '@angular/platform-browser'
import { ok, fail } from 'typescript-monads'
import { take } from 'rxjs/operators'

// tslint:disable: readonly-keyword

@Component({
  selector: 'flo-test-fixture',
  template: `
    <div *floFetchFillItem="let response of item usingOutputKey outputKey">{{response.test}}</div>
  `
})
export class FloTestComponent {
  @ViewChildren(FloFetchFillItemDirective) children: QueryList<FloFetchFillItemDirective>
  item = 'some string'
  outputKey = 123
}

@NgModule({
  declarations: [FloFetchFillItemDirective, FloTestComponent]
})
export class TestingModule { }

const createSut = () => TestBed.createComponent(FloTestComponent)

describe(FloFetchFillItemDirective.name, () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [TestingModule] }).compileComponents())
  afterEach(() => TestBed.resetTestingModule())
  it('should compile', () => {
    const sut = createSut()
    sut.detectChanges()
    expect(sut).toBeTruthy()
  })

  it('should read DSL style inputs', () => {
    const fixture = createSut()
    fixture.detectChanges()
    const fixtureInstance = fixture.debugElement.componentInstance as FloTestComponent
    fixtureInstance.children.changes.subscribe((a: QueryList<FloFetchFillItemDirective>) => {
      const directives = a.toArray()
      const item = directives[0]
      expect(directives.length).toEqual(1)
      expect(item.input).toEqual('some string')
      expect(item.outputKey).toEqual('123')
    })
    fixtureInstance.children.notifyOnChanges()
  })

  it('should render', () => {
    const fixture = createSut()
    fixture.detectChanges()
    const fixtureInstance = fixture.debugElement.componentInstance as FloTestComponent
    fixtureInstance.children.changes.pipe(take(1)).subscribe((a: QueryList<FloFetchFillItemDirective>) => {
      const directives = a.toArray()
      const item = directives[0]
      item.setResponse(ok({ test: 'I am a value!' }))
      fixture.detectChanges()

      const d = fixture.debugElement.queryAll(By.css('div'))
      expect(d[0].nativeElement.innerText).toEqual('I am a value!')
    })
    fixtureInstance.children.notifyOnChanges()
  })

  it('should not render', done => {
    const fixture = createSut()
    fixture.detectChanges()
    const fixtureInstance = fixture.debugElement.componentInstance as FloTestComponent
    fixtureInstance.children.changes.pipe(take(1)).subscribe((a: QueryList<FloFetchFillItemDirective>) => {
      const directives = a.toArray()
      const item = directives[0]
      item.setResponse(fail('err'))
      fixture.detectChanges()
      expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(0)
      done()
    })
    fixtureInstance.children.notifyOnChanges()
  })
})
