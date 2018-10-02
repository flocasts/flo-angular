import { Component, ChangeDetectionStrategy } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { distinctUntilChanged, map, startWith, debounceTime } from 'rxjs/operators'
import { ICompConfigForm } from './framer.interface'

const objectsAreEqual = (a: any) => (b: any) => JSON.stringify(a) === JSON.stringify(b)

const FORM_DEBOUNCE_TIME = 1000
const DEFAULT_MAX_HEIGHT = 600
const DEFAULT_ELEMENT_COUNT = 4
const DEFAULT_VIDEO_SOURCE_URL = 'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/video.mp4'

@Component({
  selector: 'app-framer',
  templateUrl: './framer.component.html',
  styleUrls: ['./framer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FramerComponent {
  readonly formGroup = new FormGroup({
    maxHeight: new FormControl(DEFAULT_MAX_HEIGHT, [Validators.required]),
    elementCount: new FormControl(DEFAULT_ELEMENT_COUNT, [Validators.required]),
    videoSource: new FormControl(DEFAULT_VIDEO_SOURCE_URL, [Validators.required])
  })

  readonly view_ = this.formGroup.valueChanges.pipe(
    // debounceTime(FORM_DEBOUNCE_TIME),
    distinctUntilChanged((a, b) => objectsAreEqual(a)(b)),
    startWith(this.formGroup.value),
    map<ICompConfigForm, any>(a => {
      return {
        maxHeight: a.maxHeight,
        videos: Array(a.elementCount).fill(0).map((c, id) => {
          return {
            id,
            src: a.videoSource
          }
        })
      }
    })
  )

  readonly trackByVideoId = (_: number, item: any) => item.id
}
