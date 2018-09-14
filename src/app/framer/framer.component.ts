import { Component } from '@angular/core'

const fill = (num: number) => Array(num).fill(0).map((_, i) => i + 1)
const redNested = (num: number) => fill(num).reduce((acc, _curr, idx) => [...acc, fill(idx)], [])

@Component({
  selector: 'app-framer',
  templateUrl: './framer.component.html',
  styleUrls: ['./framer.component.scss']
})
export class FramerComponent {
  readonly containers = redNested(10)
}
