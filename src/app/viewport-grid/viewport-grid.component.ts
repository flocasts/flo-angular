import {
  Component, ChangeDetectionStrategy, ViewChild
} from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { distinctUntilChanged, map, startWith, tap } from 'rxjs/operators'
import { ICompConfigForm } from './viewport-grid.interface'
import { ViewportGridComponent, FloViewportManagerService } from '@flosportsinc/ng-viewport-grid'
import { Subject, combineLatest } from 'rxjs';

const DEFAULT_MAX_HEIGHT = 600
const DEFAULT_ELEMENT_COUNT = 4
const DEFAULT_VIDEO_SOURCE_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'

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

  readonly items$ = this.items.pipe(startWith([
    DEFAULT_VIDEO_SOURCE_URL,
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
  ]))

  readonly items2$ = combineLatest(this.selectedIndex, this.items$).pipe(
    map(a => {
      return {
        index: a[0],
        items: a[1]
      }
    }),
    tap(console.log)
  )

  constructor(public vms: FloViewportManagerService) {
    vms.setVisible(4)
    vms.set('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', 0)
  }

  @ViewChild(ViewportGridComponent) readonly grid: ViewportGridComponent

  readonly formGroup = new FormGroup({
    maxHeight: new FormControl(DEFAULT_MAX_HEIGHT, [Validators.required]),
    elementCount: new FormControl(DEFAULT_ELEMENT_COUNT, [Validators.required]),
    videoSource: new FormControl(DEFAULT_VIDEO_SOURCE_URL, [Validators.required])
  })

  readonly view_ = this.formGroup.valueChanges.pipe(
    distinctUntilChanged((a, b) => objectsAreEqual(a)(b)),
    startWith(this.formGroup.value),
    map<ICompConfigForm, any>(mapFromForm)
  )

  readonly trackByFn = (idx: number) => idx

  ngAfterViewInit() {
    // this.grid.itemSelected$.subscribe(console.log)
  }

  setItem(item: any, index: number) {
    this.vms.set(item, index)
  }

  itemSelected(evt: any) {
    this.selectedIndex.next(evt.selectedIndex)
  }
}
