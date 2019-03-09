import {
  Component, ChangeDetectionStrategy, ViewChild
} from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { distinctUntilChanged, map, startWith } from 'rxjs/operators'
import { ICompConfigForm } from './viewport-grid.interface'
import { ViewportGridComponent } from '@flosportsinc/ng-viewport-grid'
import { test } from 'shelljs';

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

  test(e: any) {
    console.log(e)
  }
}
