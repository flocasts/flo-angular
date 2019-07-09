import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'
import { FloFullscreenService } from '@flosportsinc/ng-fullscreen'

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenComponent implements OnDestroy {
  readonly onDestroy = new Subject()

  constructor(fs: FloFullscreenService) {
    fs.fullscreen$.subscribe(i => console.log('is fullscreen', i))
  }

  ngOnDestroy() {
    this.onDestroy.next()
  }
}
