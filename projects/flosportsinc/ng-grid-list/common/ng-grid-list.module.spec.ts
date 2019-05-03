import { FloGridListModule } from './ng-grid-list.module'
import { NgModule, Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT } from './ng-grid-list.module.defaults'
import {
  FLO_GRID_LIST_DEFAULT_VIEWCOUNT, FLO_GRID_LIST_MIN_VIEWCOUNT, FLO_GRID_LIST_MAX_VIEWCOUNT,
  FLO_GRID_LIST_OVERLAY_ENABLED, FLO_GRID_LIST_OVERLAY_THROTTLE, FLO_GRID_LIST_OVERLAY_FADEOUT,
  FLO_GRID_LIST_OVERLAY_START
} from './ng-grid-list.tokens'

interface TItem {
  readonly title: string
}

@Component({
  selector: 'flo-grid-list-test',
  template: `
  <button id="setViewCount1" (click)="setViewCount(1)">1</button>
  <button id="setViewCount2" (click)="setViewCount(2)">2</button>
  <button id="setViewCount4" (click)="setViewCount(4)">4</button>
  <button id="setViewCount9" (click)="setViewCount(9)">9</button>
  <button id="setViewCount16" (click)="setViewCount(16)">16</button>
  <button id="setViewCount25" (click)="setViewCount(25)">25</button>

  <flo-grid-tiles #grid>
  </flo-grid-tiles>

  <h3>Grid List 1</h3>
  <flo-grid-list [gridTileRef]="grid" [items]="items">
    <div *floGridListItem="let item">
      {{ item.title }}
    </div>
  </flo-grid-list>

  <h3>Grid List 2</h3>
  <flo-grid-list [gridTileRef]="grid" [items]="items2">
    <div *floGridListItem="let item">
      {{ item.title }}
    </div>
  </flo-grid-list>

  <h3>Grid List 3</h3>
  <flo-grid-list [gridTileRef]="grid" [items]="items3">
    <div *floGridListItem="let item">
      {{ item.title }}
    </div>
  </flo-grid-list>
  `
})
export class FloGridListTestComponent {
  readonly items: ReadonlyArray<TItem> = [{ title: 'Band of Brothers' }, { title: 'Forrest Gump' }]
  readonly items2: ReadonlyArray<TItem> = [{ title: 'Forrest Gump' }, { title: 'Band of Brothers' }]
  readonly items3: ReadonlyArray<TItem> = [{ title: 'Interstellar' }]

  setViewCount(count: number) {
    console.log(count)
  }
}

@NgModule({
  imports: [FloGridListModule],
  declarations: [FloGridListTestComponent]
})
export class FloGridListTestingModule { }


describe(FloGridListModule.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [FloGridListTestingModule] }).compileComponents()
  })

  afterEach(() => TestBed.resetTestingModule())

  it('should construct', () => expect(new FloGridListModule()).toBeTruthy())

  it('should construct with empty configuration', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloGridListModule.config({})]
    }).compileComponents()

    expect(TestBed.get(FLO_GRID_LIST_DEFAULT_VIEWCOUNT)).toEqual(DEFAULT_FLO_GRID_LIST_DEFAULT_VIEWCOUNT)
  })

  it('should construct with custom configuration', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [FloGridListModule.config({
        count: 25,
        max: 64,
        min: 4,
        overlay: {
          fadeout: 1,
          throttle: 2,
          enabled: false,
          start: false
        }
      })]
    }).compileComponents()

    expect(TestBed.get(FLO_GRID_LIST_DEFAULT_VIEWCOUNT)).toEqual(25)
    expect(TestBed.get(FLO_GRID_LIST_MIN_VIEWCOUNT)).toEqual(4)
    expect(TestBed.get(FLO_GRID_LIST_MAX_VIEWCOUNT)).toEqual(64)
    expect(TestBed.get(FLO_GRID_LIST_OVERLAY_ENABLED)).toEqual(false)
    expect(TestBed.get(FLO_GRID_LIST_OVERLAY_THROTTLE)).toEqual(2)
    expect(TestBed.get(FLO_GRID_LIST_OVERLAY_FADEOUT)).toEqual(1)
    expect(TestBed.get(FLO_GRID_LIST_OVERLAY_START)).toEqual(false)
  })

  it('', () => {
    const fixture = TestBed.createComponent(FloGridListTestComponent)
    fixture.detectChanges()

    fixture.debugElement.query(By.css('#setViewCount9')).nativeElement.click()
  })
})
