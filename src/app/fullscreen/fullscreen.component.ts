import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core'
import { FloFullscreenService } from '@flosportsinc/ng-fullscreen'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenComponent implements OnDestroy {
  readonly onDestroy = new Subject()

  constructor(fs: FloFullscreenService) {
    fs.canGoFullscreen$.subscribe(console.log)
  }

  ngOnDestroy() {
    this.onDestroy.next()
  }
}
