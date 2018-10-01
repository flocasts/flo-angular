import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { distinctUntilChanged } from 'rxjs/operators'

const fill = (num: number) => Array(num).fill(0).map((_, i) => i + 1)
const redNested = (num: number) => fill(num).reduce((acc, _curr, idx) => [...acc, fill(idx)], [])
const objectsAreEqual = (a: any) => (b: any) => JSON.stringify(a) === JSON.stringify(b)

const MAX_HEIGHT_START_VALUE = 900
const ELEMENT_COUNT_START_VALUE = 4

@Component({
  selector: 'app-framer',
  templateUrl: './framer.component.html',
  styleUrls: ['./framer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FramerComponent implements OnInit {
  readonly containers = redNested(ELEMENT_COUNT_START_VALUE)

  readonly formGroup = new FormGroup({
    maxHeight: new FormControl(MAX_HEIGHT_START_VALUE, [Validators.required]),
    elementCount: new FormControl(ELEMENT_COUNT_START_VALUE, [Validators.required])
  })

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(distinctUntilChanged((a, b) => objectsAreEqual(a)(b)))
      .subscribe(console.log)
  }
}
