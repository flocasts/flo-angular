import {
  Component, ChangeDetectionStrategy, ViewChild
} from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { distinctUntilChanged, map, startWith } from 'rxjs/operators'
import { ICompConfigForm } from './viewport-grid.interface'
import { ViewportGridComponent } from '@flosportsinc/viewport-grid'
import { maybe } from 'typescript-monads'

const DEFAULT_MAX_HEIGHT = 600
const DEFAULT_ELEMENT_COUNT = 4
const DEFAULT_VIDEO_SOURCE_URL = 'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/video.mp4'

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
  selector: 'app-framer',
  templateUrl: './framer.component.html',
  styleUrls: ['./framer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FramerComponent {
  @ViewChild(ViewportGridComponent) readonly grid?: ViewportGridComponent

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

  readonly trackByVideoId = (_: number, item: any) => item.id

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    maybe(this.grid)
      .tapSome(grid => {
        grid.itemElementSelected$
          .subscribe(a => {
            a.selectedViewportElement.tapSome(console.log)
          })
      })
  }
}
