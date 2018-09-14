import { Component } from '@angular/core'

const fill = (num: number) => Array(num).fill(0).map((_, i) => i + 1)

@Component({
  selector: 'app-framer',
  templateUrl: './framer.component.html',
  styleUrls: ['./framer.component.scss']
})
export class FramerComponent {
  readonly components = fill(10)
  readonly containers = this.components.reduce((acc, _curr, idx) => [...acc, fill(idx)], [])
}
