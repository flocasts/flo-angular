import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { distinctUntilChanged } from 'rxjs/operators'

const fill = (num: number) => Array(num).fill(0).map((_, i) => i + 1)
const redNested = (num: number) => fill(num).reduce((acc, _curr, idx) => [...acc, fill(idx)], [])

const MAX_HEIGHT_START_VALUE = 900

@Component({
  selector: 'app-framer',
  templateUrl: './framer.component.html',
  styleUrls: ['./framer.component.scss']
})
export class FramerComponent implements OnInit {
  readonly containers = redNested(10)
  readonly formGroup = new FormGroup({
    maxHeight: new FormControl(MAX_HEIGHT_START_VALUE, [])
  })

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(console.log)
  }
}
