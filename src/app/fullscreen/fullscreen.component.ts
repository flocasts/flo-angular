import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenComponent implements OnDestroy {
  readonly onDestroy = new Subject()

  ngOnDestroy() {
    this.onDestroy.next()
  }
}
