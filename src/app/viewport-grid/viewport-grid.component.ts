import {
  Component, ChangeDetectionStrategy, ViewChild
} from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { distinctUntilChanged, map, startWith, tap } from 'rxjs/operators'
import { ICompConfigForm } from './viewport-grid.interface'
import { ViewportGridComponent, FloViewportManagerService } from '@flosportsinc/ng-viewport-grid'
import { Subject, combineLatest } from 'rxjs'
import { maybe } from 'typescript-monads'

const DEFAULT_MAX_HEIGHT = 600
const VIDEO_DB: ReadonlyArray<any> = [
  {
    id: 1,
    title: 'How David Taylor Became Magic Man',
    src: 'https://cdn-flo.flowrestling.org/uploaded/gkMqKG2RjoggDmEN69egZmkO1nKr4qNK/playlist.m3u8'
  },
  {
    id: 2,
    title: 'Dake - Taylor Gold Medal Interview',
    src: 'https://cdn-flo.flowrestling.org/uploaded/gEzpz1RK5Wkn3rOj2N3gV7brnQyo8DeJ/playlist.m3u8'
  },
  {
    id: 3,
    title: 'My Best Rival, Kyle Dake And David Taylor FloFilm',
    src: 'https://cdn-flo.flowrestling.org/migrated/hvcnN2ZzE6tIEglt0GrdtRzv01NFX7o8/playlist.m3u8'
  },
  {
    id: 4,
    title: 'Nick Suriano: Fearless Warrior',
    src: 'https://cdn-flo.flowrestling.org/migrated/w1cnhsZTE6_gGu2ocRadp16NyxD3KwID/playlist.m3u8'
  }
]

const objectsAreEqual = (a: any) => (b: any) => JSON.stringify(a) === JSON.stringify(b)
const mapFromForm = (input: ICompConfigForm) => {
  return {
    maxHeight: input.maxHeight,
    videos: Array(input.elementCount).fill(0).map((_, id) => {
      return {
        id,
        src: input.videoSource
      }
    })
  }
}

@Component({
  selector: 'app-viewport-grid',
  templateUrl: './viewport-grid.component.html',
  styleUrls: ['./viewport-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FramerComponent {
  private readonly items = new Subject<ReadonlyArray<any>>()
  private readonly selectedIndex = new Subject<number>()

  readonly viewItems$ = this.vms.viewItems$.pipe(map(a => {
    return a.map(i => {
      return {
        hasSomethingToSee: i.map(() => true).valueOr(false),
        item: i.valueOrUndefined()
      }
    })
  }))

  readonly items$ = this.items.pipe(startWith(VIDEO_DB))

  readonly items2$ = combineLatest(this.selectedIndex, this.items$).pipe(
    map(a => {
      return {
        index: a[0],
        items: a[1]
      }
    }),
    // tap(console.log)
  )

  constructor(public vms: FloViewportManagerService) {
    vms.setVisible(4)
    vms.set(VIDEO_DB[0].src, 0)
    vms.set(VIDEO_DB[1].src, 3)
  }

  @ViewChild(ViewportGridComponent) readonly grid: ViewportGridComponent

  readonly formGroup = new FormGroup({
    maxHeight: new FormControl(DEFAULT_MAX_HEIGHT, [Validators.required])
  })

  readonly view_ = this.formGroup.valueChanges.pipe(
    distinctUntilChanged((a, b) => objectsAreEqual(a)(b)),
    startWith(this.formGroup.value),
    map<ICompConfigForm, any>(mapFromForm)
  )

  readonly trackByFn = (idx: number, item: any) => {
    // console.log(item)
    return item.item
  }

  setItem(item: any, index: number) {
    this.vms.set(item, index)
  }

  itemSelected(evt: any) {
    this.selectedIndex.next(evt.selectedIndex)
  }

  testerIdx = 0

  vpCountr = 1

  thing(num: number) {
    this.vpCountr = num
  }

  gridListItems = VIDEO_DB

  removeListItem() {
    this.gridListItems = [
      ...this.gridListItems.slice(0, this.gridListItems.length - 1)
    ]
  }

  addListItem() {
    this.gridListItems = [
      ...this.gridListItems,
      {
        id: this.gridListItems.length + 1,
        title: 'Nick Suriano: Fearless Warrior',
        src: 'https://cdn-flo.flowrestling.org/migrated/w1cnhsZTE6_gGu2ocRadp16NyxD3KwID/playlist.m3u8'
      }
    ]
  }

  emptyList() {
    this.gridListItems = []
  }
}
