import { Component, ChangeDetectionStrategy, ElementRef } from '@angular/core'
import { FloFullscreenService } from '@flosportsinc/ng-fullscreen'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenComponent {
  onDestroy = new Subject()

  constructor(elmRef: ElementRef, d: FloFullscreenService) {
    d.fullscreen$.pipe(takeUntil(this.onDestroy)).subscribe(console.log, console.error)
  }

  ngOnDestroy() {
    this.onDestroy.next()
  }
}
